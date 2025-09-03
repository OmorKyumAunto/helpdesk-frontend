import { SendOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Select, Modal, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useAssignLocationToAdminMutation } from "../api/adminEndPoint";
import { useGetUserUnitBuildingQuery } from "../../complex/api/complexEndPoint";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";
import { skipToken } from "@reduxjs/toolkit/query";

const AssignLocationToAdmin = ({ id, searchAccess }: any) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedComplexIds, setSelectedComplexIds] = useState<number[]>([]);
  const [buildingIds, setBuildingIds] = useState<number[] | typeof skipToken>(skipToken);

  const [assignLocation, { isLoading, isSuccess, isError }] = useAssignLocationToAdminMutation();

  const { data: complexData, isLoading: complexLoading } = useGetUserUnitBuildingQuery({ id });
  const { data: unitOptionsData, isLoading: unitLoading } = useGetBuildingWiseLocationQuery(buildingIds);

  // Reset form and state when ID changes
  useEffect(() => {
    form.resetFields();
    setSelectedItems([]);
    setSelectedComplexIds([]);
    setBuildingIds(skipToken);
  }, [id, form]);

  // Memoized complex options
  const complexOptions = useMemo(() => {
    return complexData?.data?.map((complex: any) => ({
      value: complex.id,
      label: complex.name,
    })) || [];
  }, [complexData]);

  // Memoized unit options (exclude pre-assigned units)
  const unitOptions = useMemo(() => {
    return unitOptionsData?.data?.map((unit: any) => ({
      value: unit.id,
      label: unit.name,
    })) || [];
  }, [unitOptionsData]);

  // Assigned units from `searchAccess`
  const assignedUnitOptions = useMemo(() => {
    return (searchAccess || []).map((unit: any) => ({
      value: unit.unit_id,
      label: unit.unit_name || String(unit.unit_id),
    }));
  }, [searchAccess]);

  // Prefill unit_id if needed (optional, can be removed)
  useEffect(() => {
    form.setFieldValue("unit_id", []);
    setSelectedItems([]);
  }, [form, searchAccess]);

  // Show success message and close modal
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
      message.success("Location assigned successfully");
    }
  }, [isSuccess, dispatch]);

  // Show error message
  useEffect(() => {
    if (isError) {
      message.error("Failed to assign location. Please try again.");
    }
  }, [isError]);

  const handleComplexChange = (complexIds: number[]) => {
    setSelectedComplexIds(complexIds);
    setSelectedItems([]);
    form.setFieldValue("unit_id", []);
    setBuildingIds(complexIds.length > 0 ? complexIds : skipToken);
  };

  const onFinish = () => {
    Modal.confirm({
      title: "Confirm Assignment",
      content: "Are you sure you want to assign these locations?",
      onOk: () => {
        assignLocation({
          id,
          body: {
            seating_location: selectedItems.filter((item): item is number => typeof item === "number"),
          },
        });
      },
    });
  };

  return (
    <Row justify="center" align="middle">
      <Col xs={24}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card className="border" style={{ marginBottom: 16, marginTop: 16 }}>

             {/* Assigned Units (Read-only) */}
            <Row gutter={[5, 16]}>
              <Col xs={24}>
                <Form.Item label="Assigned Units">
                  <Select
                    mode="multiple"
                    disabled
                    value={assignedUnitOptions.map(({ value }: { value: number; label: string }) => value)}
                    style={{ width: "100%" }}
                    options={assignedUnitOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* Complex Selector */}
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
                    loading={complexLoading}
                    style={{ width: "100%" }}
                    options={complexOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

           

            {/* Assign New Locations */}
            <Row gutter={[5, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Assign New Locations"
                  name="unit_id"
                  rules={[{ required: true, message: "Please Select Location" }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Location"
                    value={selectedItems}
                    onChange={setSelectedItems}
                    loading={unitLoading}
                    disabled={selectedComplexIds.length === 0}
                    style={{ width: "100%" }}
                    options={unitOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
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
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AssignLocationToAdmin;
