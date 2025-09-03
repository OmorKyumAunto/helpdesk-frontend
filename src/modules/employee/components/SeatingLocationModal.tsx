import React, { useEffect, useState } from "react";
import { Modal, Form, Select } from "antd";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useUpdateEmployeeSeatingLocationMutation } from "../api/employeeEndPoint";

interface SeatingLocationModalProps {
  open: boolean;
  onCancel: () => void;
}

const SeatingLocationModal: React.FC<SeatingLocationModalProps> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [buildings, setBuildings] = useState<{ value: number; label: string }[]>(
    []
  );
  const [buildingId, setBuildingId] = useState<number[] | typeof skipToken>(
    skipToken
  );

  // 🔹 current logged-in user profile
  const { data: { data: profile } = {} } = useGetMeQuery();

  // 🔹 queries
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: locationData, isLoading: locationLoading } =
    useGetBuildingWiseLocationQuery(buildingId);

  // 🔹 mutation
  const [updateSeatingLocation, { isLoading: updateLoading }] =
    useUpdateEmployeeSeatingLocationMutation();

  // Populate building list on unit change
  const handleUnitChange = (unitId: number) => {
    const selectedUnit = unitData?.data?.find((u: any) => u.id === unitId);

    if (selectedUnit) {
      const availableBuildings =
        selectedUnit.building?.map((b: any) => ({
          value: b.id,
          label: b.name,
        })) || [];
      setBuildings(availableBuildings);
    } else {
      setBuildings([]);
    }

    // reset
    setBuildingId(skipToken);
    form.setFieldsValue({
      building_id: undefined,
      seating_location: undefined,
    });
  };

  // When building is selected → trigger query
  const handleBuildingChange = (id: number) => {
    setBuildingId(id ? [id] : skipToken);
    form.setFieldsValue({ seating_location: undefined });
  };

  // Submit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // ✅ PUT request with employee id from profile
      if (profile?.id) {
        await updateSeatingLocation({
          id: profile.id,
          data: { seating_location: values.seating_location },
        }).unwrap();
      }
      form.resetFields();
      onCancel();
    } catch {
      // validation or API error handled by notification
    }
  };

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setBuildings([]);
      setBuildingId(skipToken);
    }
  }, [open, form]);

  return (
    <Modal
      title="Update Seating Location"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={updateLoading}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        {/* Select Unit */}
        <Form.Item
          label="Select Unit"
          name="unit_id"
          rules={[{ required: true, message: "Please select a unit!" }]}
        >
          <Select
            loading={unitIsLoading}
            placeholder="Select Unit Name"
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

        {/* Select Complex */}
        <Form.Item
          label="Select Complex"
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

        {/* Seating Location */}
        <Form.Item
          label="Seating Location"
          name="seating_location"
          rules={[
            { required: true, message: "Please select seating location!" },
          ]}
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
      </Form>
    </Modal>
  );
};

export default SeatingLocationModal;
