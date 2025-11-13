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

interface Building {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  title: string;
  building?: Building[];
}

interface Location {
  id: number;
  name?: string;
  location?: string;
}

interface BuildingOption {
  value: number;
  label: string;
}

interface SeatingLocationModalProps {
  employee?: any;
}

const SeatingLocationModal: React.FC<SeatingLocationModalProps> = ({ employee }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [buildings, setBuildings] = useState<BuildingOption[]>([]);
  const [buildingId, setBuildingId] = useState<number[] | typeof skipToken>(skipToken);
  const [isInitialized, setIsInitialized] = useState(false);

  // Current logged-in user profile - always fetch fresh
  const { data: { data: profile } = {}, refetch: refetchProfile } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Queries with always fresh data
  const {
    data: unitData,
    isLoading: unitIsLoading,
    refetch: refetchUnits,
  } = useGetUnitsQuery(
    { status: "active" },
    { 
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  const {
    data: locationData,
    isLoading: locationLoading,
    refetch: refetchLocations,
  } = useGetBuildingWiseLocationQuery(buildingId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    skip: buildingId === skipToken,
  });

  // Mutation
  const [updateSeatingLocation, { isLoading: updateLoading }] =
    useUpdateEmployeeSeatingLocationMutation();

  // Force refetch all data when modal opens
  useEffect(() => {
    const initializeModal = async () => {
      // Reset all states
      form.resetFields();
      setBuildings([]);
      setBuildingId(skipToken);
      setIsInitialized(false);

      // Force refetch all data
      await Promise.all([
        refetchProfile(),
        refetchUnits(),
      ]);

      setIsInitialized(true);
    };

    initializeModal();

    // Cleanup on unmount
    return () => {
      form.resetFields();
      setBuildings([]);
      setBuildingId(skipToken);
      setIsInitialized(false);
    };
  }, []); // Empty dependency - runs only on mount/unmount

  // Handle unit change
  const handleUnitChange = (unitId: number) => {
    const selectedUnit = unitData?.data?.find((u: Unit) => u.id === unitId);

    if (selectedUnit) {
      const buildingOptions = selectedUnit.building?.map((b: Building) => ({
        value: b.id,
        label: b.name,
      })) || [];
      
      setBuildings(buildingOptions);
    } else {
      setBuildings([]);
    }

    // Reset dependent fields
    setBuildingId(skipToken);
    form.setFieldsValue({ 
      building_id: undefined, 
      seating_location: undefined 
    });
  };

  // Handle building change
  const handleBuildingChange = async (id: number) => {
    if (id) {
      setBuildingId([id]);
      form.setFieldsValue({ seating_location: undefined });
      
      // Force refetch locations for the new building
      setTimeout(() => {
        refetchLocations();
      }, 100);
    } else {
      setBuildingId(skipToken);
      form.setFieldsValue({ seating_location: undefined });
    }
  };

  // Prefill form with employee data - only after initialization
  useEffect(() => {
    if (!isInitialized || !employee || !unitData?.data?.length) return;

    const { seating_unit_id, building_id, seating_location } = employee;

    if (seating_unit_id) {
      // Set unit
      form.setFieldsValue({ unit_id: seating_unit_id });
      
      // Trigger unit change to populate buildings
      const selectedUnit = unitData.data.find((u: Unit) => u.id === seating_unit_id);
      if (selectedUnit) {
        const buildingOptions = selectedUnit.building?.map((b: Building) => ({
          value: b.id,
          label: b.name,
        })) || [];
        
        setBuildings(buildingOptions);

        // Set building and location after dropdowns populate
        if (building_id && buildingOptions.some((b: BuildingOption) => b.value === building_id)) {
          setTimeout(() => {
            form.setFieldsValue({ building_id });
            setBuildingId([building_id]);

            if (seating_location) {
              setTimeout(() => {
                form.setFieldsValue({ seating_location });
              }, 150);
            }
          }, 100);
        }
      }
    }
  }, [isInitialized, employee, unitData]);

  // Refetch locations when buildingId changes
  useEffect(() => {
    if (buildingId !== skipToken) {
      refetchLocations();
    }
  }, [buildingId, refetchLocations]);

  // Submit handler
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const userId = profile?.id || employee?.id;
      
      if (!userId) {
        message.error("❌ User information not found. Please try again.");
        return;
      }

      await updateSeatingLocation({
        id: userId,
        data: { seating_location: values.seating_location },
      }).unwrap();

      message.success("✅ Seating location updated successfully!");
      
      // Reset form and close modal
      form.resetFields();
      setBuildings([]);
      setBuildingId(skipToken);
      
      dispatch(setCommonModal({ show: false }));
      
      // Refetch profile to get updated data
      refetchProfile();
    } catch (error: any) {
      console.error("Update error:", error);
      message.error(error?.data?.message || "❌ Failed to update seating location. Try again.");
    }
  };

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
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit} 
        style={{ marginTop: 12 }}
        preserve={false}
      >
        <Row gutter={16}>
          {/* Select Unit */}
          <Col span={12}>
            <Form.Item
              label="Unit"
              name="unit_id"
              rules={[{ required: true, message: "Please select a unit!" }]}
            >
              <Select
                loading={unitIsLoading || !isInitialized}
                placeholder="Select Unit"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={unitData?.data?.map((unit: Unit) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                onChange={handleUnitChange}
                allowClear
                disabled={!isInitialized}
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
                disabled={buildings.length === 0 || !isInitialized}
                onChange={handleBuildingChange}
                allowClear
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
              locationData?.data?.map((loc: Location) => ({
                value: loc.id,
                label: loc.name || loc.location,
              })) || []
            }
            loading={locationLoading}
            disabled={buildingId === skipToken || !isInitialized}
            allowClear
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item style={{ textAlign: "right", marginTop: 24, marginBottom: 0 }}>
          <Button
            onClick={() => {
              form.resetFields();
              setBuildings([]);
              setBuildingId(skipToken);
              dispatch(setCommonModal({ show: false }));
            }}
            style={{ borderRadius: 8, padding: "6px 18px" }}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateLoading}
            disabled={!isInitialized}
            style={{
              borderRadius: 8,
              marginLeft: 12,
              padding: "6px 20px",
              background: "linear-gradient(90deg, #1677ff 0%, #4096ff 100%)",
              border: "none",
            }}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SeatingLocationModal;