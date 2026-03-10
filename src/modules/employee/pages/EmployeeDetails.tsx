import { Button, Card, Col, Popconfirm, Row, Tabs, Tag, Typography, Select, Space, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useEmployeeAssignToAdminMutation } from "../api/employeeEndPoint";
import { IEmployee } from "../types/employeeTypes";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useUpdateEmployeeSeatingLocationMutation } from "../api/employeeEndPoint";
import { Form } from "antd";

const { Title, Text } = Typography;

const FieldItem = ({ label, value }: { label: string; value?: string | React.ReactNode }) => (
  <div style={{ marginBottom: 12 }}>
    <Text strong>{label}: </Text>
    <Text>{value || "N/A"}</Text>
  </div>
);

const EmployeeDetails = ({ employee }: { employee: IEmployee }) => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [assignToAdmin, { isSuccess }] = useEmployeeAssignToAdminMutation();
  const [buildings, setBuildings] = useState<{ value: number; label: string }[]>([]);
  const [buildingId, setBuildingId] = useState<number[] | typeof skipToken>(skipToken);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Queries
  const { data: { data: profile } = {} } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });
  const { data: locationData, isLoading: locationLoading } =
    useGetBuildingWiseLocationQuery(buildingId);

  // Mutation
  const [updateSeatingLocation, { isLoading: updateLoading, isSuccess: updateSuccess }] =
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

  const {
    id,
    employee_id,
    name,
    designation,
    department,
    email,
    contact_no,
    joining_date,
    unit_name,
    location,
    status,
    licenses,
    role_id,
    blood_group,
    grade,
    date_of_birth,
    line_manager_name,
    line_manager_id,
    line_of_business,
    business_type,
    pabx,
    seating_location,
    seating_location_name,
    building_id,
    building_name
  } = employee || {};

  // Close modal when assign to admin is successful
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
    }
  }, [isSuccess, dispatch]);

  // Close modal when seating location update is successful
  useEffect(() => {
    if (updateSuccess) {

      dispatch(setCommonModal());
    }
  }, [updateSuccess, dispatch]);

  // Reset form state when modal opens/closes
  useEffect(() => {
    setIsEditingLocation(false);
    form.resetFields();
    setBuildings([]);
    setBuildingId(skipToken);
  }, [employee?.id]); // Reset when employee changes (modal reopens)

  const items = [
    {
      key: "1",
      label: "Basic Info",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <FieldItem label="Employee Name" value={name} />
              <FieldItem label="Employee ID" value={employee_id} />
              <FieldItem label="Email" value={email} />
              <FieldItem label="Contact No" value={contact_no} />
              <FieldItem
                label="Status"
                value={status === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
              />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <FieldItem label="Blood Group" value={blood_group} />
              <FieldItem label="Date of Birth" value={date_of_birth ? dayjs(date_of_birth).format("DD-MM-YYYY") : "N/A"} />
              <FieldItem label="Grade" value={grade} />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Work Info",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <FieldItem label="Designation" value={designation} />
              <FieldItem label="Department" value={department} />
              <FieldItem label="Payroll Unit" value={unit_name} />
              <FieldItem label="Location" value={location} />
              <FieldItem label="Joining Date" value={joining_date ? dayjs(joining_date).format("DD-MM-YYYY") : "N/A"} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card>
              <FieldItem label="Business Type" value={business_type} />
              <FieldItem label="Line of Business" value={line_of_business} />
              <FieldItem label="PABX" value={pabx} />
              <FieldItem label="Line Manager" value={line_manager_name} />
              <FieldItem label="Line Manager Emp. ID" value={line_manager_id} />
            </Card>
          </Col>
        </Row>
      ),
    },
    ...(roleId !== 3
      ? [
        {
          key: "5",
          label: "Seating Location",
          children: (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={24}>
                <Card>
                  <FieldItem
                    label="Seating Location"
                    value={
                      seating_location_name
                        ? `${seating_location_name} (${building_name || "N/A"})`
                        : "N/A"
                    }
                  />

                  {!isEditingLocation ? (
                    <Button type="primary" onClick={() => setIsEditingLocation(true)}>
                      Update Location
                    </Button>
                  ) : (
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={async (values) => {
                        try {
                          await updateSeatingLocation({
                            id,
                            data: { seating_location: values.seating_location },
                          }).unwrap();
                          // Success message and modal close handled by useEffect
                        } catch (err: any) {
                          message.error(err?.data?.message || "Failed to update seating location");
                        }
                      }}
                    >
                      <Space direction="vertical" style={{ width: "100%", marginTop: 12 }}>
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

                        <Form.Item
                          label="Building"
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

                        <Space>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={updateLoading}
                            style={{
                              borderRadius: 8,
                              padding: "6px 20px",
                              background: "linear-gradient(90deg, #1677ff 0%, #4096ff 100%)",
                              border: "none",
                            }}
                          >
                            Save Changes
                          </Button>
                          <Button
                            onClick={() => {
                              setIsEditingLocation(false);
                              form.resetFields();
                              setBuildings([]);
                              setBuildingId(skipToken);
                            }}
                          >
                            Cancel
                          </Button>
                        </Space>
                      </Space>
                    </Form>
                  )}
                </Card>
              </Col>
            </Row>
          ),
        }
      ]
      : []),
    ...(roleId !== 3
      ? [
        {
          key: "3",
          label: "Licenses",
          children: (
            <Card>
              <Text>
                {licenses?.length
                  ? licenses.map((item) => item?.title).join(", ")
                  : "No Licenses Assigned"}
              </Text>
            </Card>
          ),
        },
      ]
      : []),
    ...(role_id === 3 && roleId === 1
      ? [
        {
          key: "4",
          label: "Admin Control",
          children: (
            <Card>
              <Popconfirm
                title="Assign to admin"
                description="Are you sure to assign this employee as an admin?"
                onConfirm={() => assignToAdmin(id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Confirm Admin</Button>
              </Popconfirm>
            </Card>
          ),
        },
      ]
      : []),
  ];

  return (
    <div style={{ padding: 16 }}>
      <Tabs defaultActiveKey="1" type="line" items={items} />
    </div>
  );
};

export default EmployeeDetails;