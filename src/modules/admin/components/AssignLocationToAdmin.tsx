import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Select, Modal, message, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { skipToken } from "@reduxjs/toolkit/query";

import { useAssignLocationToAdminMutation } from "../api/adminEndPoint";
import {
  useGetUserUnitBuildingQuery,
  useGetUnitWiseBuildingsQuery,
} from "../../complex/api/complexEndPoint";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";

interface IAssignLocationProps {
  id: number;
}

const AssignLocationToAdmin: React.FC<IAssignLocationProps> = ({ id }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedComplexIds, setSelectedComplexIds] = useState<number[]>([]);
  const [buildingIds, setBuildingIds] = useState<number[] | typeof skipToken>(skipToken);

  const [assignLocation, { isLoading, isSuccess, isError }] =
    useAssignLocationToAdminMutation();

  // Fetch user unit building info
  const { data: complexData, isLoading: complexLoading, isError: complexError } =
    useGetUserUnitBuildingQuery({ id });

  // Extract unitIds from searchAccess
  const unitIds = useMemo(() => {
    if (!Array.isArray(complexData?.data?.searchAccess)) return [];
    return complexData.data.searchAccess.map((u: any) => u.unit_id);
  }, [complexData]);

  // Fetch unit-wise complexes via POST body
  const { data: unitWiseBuildingData, isLoading: unitWiseLoading, isError: unitWiseError } =
    useGetUnitWiseBuildingsQuery(
      unitIds.length > 0
        ? { id: unitIds } // POST body with id array
        : skipToken
    );

  // Fetch locations for selected complexes
  const { data: unitOptionsData, isLoading: unitLoading, isError: unitError } =
    useGetBuildingWiseLocationQuery(
      Array.isArray(buildingIds) && buildingIds.length > 0
        ? buildingIds
        : skipToken
    );

  // Reset form and states when modal id changes
  useEffect(() => {
    form.resetFields();
    setSelectedItems([]);
    setSelectedComplexIds([]);
    setBuildingIds(skipToken);
  }, [id, form]);

  // Prefill complex & seating locations
  useEffect(() => {
    if (!complexData?.data) return;

    const preselectedComplexIds =
      complexData.data.complex?.map((c: any) => c.building_id) || [];
    setSelectedComplexIds(preselectedComplexIds);
    form.setFieldValue("complex_id", preselectedComplexIds);
    setBuildingIds(preselectedComplexIds.length > 0 ? preselectedComplexIds : skipToken);

    const preselectedLocations =
      complexData.data.seating_location?.map((loc: any) => loc.seating_location_id) || [];
    setSelectedItems(preselectedLocations);
    form.setFieldValue("unit_id", preselectedLocations);
  }, [complexData, form]);

  // Complex options for Select
  const complexOptions = useMemo(() => {
    if (!Array.isArray(unitWiseBuildingData?.data)) return [];
    return unitWiseBuildingData.data.map((c: any) => ({
      value: c.id,
      label: c.name,
    }));
  }, [unitWiseBuildingData]);

  // Location options for Select
  const unitOptions = useMemo(() => {
    if (!Array.isArray(unitOptionsData?.data)) return [];
    return unitOptionsData.data.map((u: any) => ({
      value: u.id,
      label: u.name,
    }));
  }, [unitOptionsData]);

  // Assigned units (read-only)
  const assignedUnitOptions = useMemo(() => {
    if (!Array.isArray(complexData?.data?.searchAccess)) return [];
    return complexData.data.searchAccess.map((unit: any) => ({
      value: unit.unit_id,
      label: unit.unit_name || String(unit.unit_id),
    }));
  }, [complexData]);

  const handleComplexChange = (complexIds: number[]) => {
    setSelectedComplexIds(complexIds);
    setSelectedItems([]);
    form.setFieldValue("unit_id", []);
    setBuildingIds(complexIds.length > 0 ? complexIds : skipToken);
  };

  const handleLocationChange = (locationIds: number[]) => {
    setSelectedItems(locationIds);
    form.setFieldValue("unit_id", locationIds);
  };

  const onFinish = () => {
    if (selectedItems.length === 0) {
      message.warning("Please select at least one location.");
      return;
    }

    Modal.confirm({
      title: "Confirm Assignment",
      content: "Are you sure you want to assign these locations?",
      onOk: () => {
        assignLocation({
          id, // outside body
          body: { seating_location: selectedItems },
        });

      },
    });
  };

  // Success / Error messages
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      message.success("Location assigned successfully");
    }
    if (isError) {
      message.error("Failed to assign location. Please try again.");
    }
  }, [isSuccess, isError, dispatch]);

  if (complexLoading || unitWiseLoading || unitLoading) return <Spin tip="Loading..." />;
  if (complexError || unitWiseError || unitError) return <div>Error loading data</div>;

  return (
    <Row justify="center" align="middle">
      <Col xs={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card className="border" style={{ marginBottom: 16, marginTop: 16 }}>
            <Row gutter={[5, 16]}>
              <Col xs={24}>
                <Form.Item label="Assigned Units">
                  <Select
                    mode="multiple"
                    disabled
                    value={assignedUnitOptions.map((u: { value: any }) => u.value)}
                    style={{ width: "100%" }}
                    options={assignedUnitOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[5, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Choose Complex"
                  name="complex_id"
                  rules={[{ required: true, message: "Please Select Complex" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Complex"
                    onChange={handleComplexChange}
                    value={selectedComplexIds}
                    loading={unitWiseLoading}
                    style={{ width: "100%" }}
                    options={complexOptions}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[5, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Assign New Locations"
                  name="unit_id"
                  rules={[{ required: true, message: "Please Select Location" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder={
                      selectedComplexIds.length === 0
                        ? "Select complex first"
                        : "Select Location"
                    }
                    value={selectedItems}
                    onChange={handleLocationChange}
                    loading={unitLoading}
                    disabled={selectedComplexIds.length === 0 || unitOptions.length === 0}
                    style={{ width: "100%" }}
                    options={unitOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item>
            <div style={{ textAlign: "end" }}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SendOutlined />}
                loading={isLoading}
                disabled={selectedItems.length === 0}
              >
                Assign
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AssignLocationToAdmin;
