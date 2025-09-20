import React, { useEffect, useState } from "react";
import { Form, Select, Button, Row, Col, Typography, message } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../../../app/store/store";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useUpdateEmployeeSeatingLocationMutation } from "../api/employeeEndPoint";

const { Title, Text } = Typography;

interface SeatingLocationModalProps {
  employee?: any;
}

const SeatingLocationModal: React.FC<SeatingLocationModalProps> = ({ employee }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [buildings, setBuildings] = useState<{ value: number; label: string }[]>([]);
  const [buildingId, setBuildingId] = useState<number[] | typeof skipToken>(skipToken);

  // Current logged-in user profile
  const { data: { data: profile } = {} } = useGetMeQuery();

  // Queries
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });
  const { data: locationData, isLoading: locationLoading } =
    useGetBuildingWiseLocationQuery(buildingId);

  // Mutation
  const [updateSeatingLocation, { isLoading: updateLoading }] =
    useUpdateEmployeeSeatingLocationMutation();

  // Populate buildings on unit change
  const handleUnitChange = (unitId: number) => {
    const selectedUnit = unitData?.data?.find((u: any) => u.id === unitId);

    if (selectedUnit) {
      setBuildings(
        selectedUnit.building?.map((b: any) => ({
          value: b.id,
          label: b.name,
        })) || []
      );
    } else {
      setBuildings([]);
    }

    setBuildingId(skipToken);
    form.setFieldsValue({ building_id: undefined, seating_location: undefined });
  };

  // Handle building change
  const handleBuildingChange = (id: number) => {
    setBuildingId(id ? [id] : skipToken);
    form.setFieldsValue({ seating_location: undefined });
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (profile?.id) {
        await updateSeatingLocation({
          id: profile.id,
          data: { seating_location: values.seating_location },
        }).unwrap();
      }

      message.success("✅ Seating location updated successfully!");
      form.resetFields();
      dispatch(setCommonModal({ show: false }));
    } catch {
      message.error("❌ Failed to update seating location. Try again.");
    }
  };

  // Prefill existing location
  useEffect(() => {
    if (employee?.seating_location) {
      form.setFieldsValue({
        seating_location: employee.seating_location.id,
        unit_id: employee.unit?.id,
        building_id: employee.building?.id,
      });
    }
  }, [employee, form]);

  return (
    <div style={{ padding: 12 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Update Seating Location
        </Title>
        <Text type="secondary">
          {employee?.name
            ? `Updating seating info for ${employee.name}`
            : "Choose the new seating location"}
        </Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 12 }}>
        <Row gutter={16}>
          {/* Select Unit */}
          <Col span={12}>
            <Form.Item
              label="Unit"
              name="unit_id"
              rules={[{ required: true, message: "Please select a unit!" }]}
            >
              <Select
                loading={unitIsLoading}
                placeholder="Select Unit"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={unitData?.data?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                onChange={handleUnitChange}
                allowClear
              />
            </Form.Item>
          </Col>

          {/* Select Complex */}
          <Col span={12}>
            <Form.Item
              label="Complex"
              name="building_id"
              rules={[{ required: true, message: "Please select a complex!" }]}
            >
              <Select
                placeholder="Select Complex"
                options={buildings}
                disabled={buildings.length === 0}
                onChange={handleBuildingChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Seating Location */}
        <Form.Item
          label="Seating Location"
          name="seating_location"
          rules={[{ required: true, message: "Please select seating location!" }]}
        >
          <Select
            placeholder="Select Location"
            options={
              locationData?.data?.map((loc: any) => ({
                value: loc.id,
                label: loc.name || loc.location,
              })) || []
            }
            loading={locationLoading}
            disabled={buildingId === skipToken}
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button
            onClick={() => dispatch(setCommonModal({ show: false }))}
            style={{ borderRadius: 8, padding: "6px 18px" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateLoading}
            style={{
              borderRadius: 8,
              marginLeft: 12,
              padding: "6px 20px",
              background: "linear-gradient(90deg, #1677ff 0%, #4096ff 100%)",
              border: "none",
            }}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SeatingLocationModal;
