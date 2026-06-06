import {
  ApartmentOutlined,
  BankOutlined,
  CalendarOutlined,
  ContactsOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PushpinOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Popconfirm,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetBuildingWiseLocationQuery } from "../../complex/api/complexlocationEndPoint";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import {
  useEmployeeAssignToAdminMutation,
  useUpdateEmployeeSeatingLocationMutation,
} from "../api/employeeEndPoint";
import { IEmployee } from "../types/employeeTypes";
import { avatarGradient, BRAND, getAvatarColor, getInitials, LINE, LINE_SOFT } from "../utils/avatar";

const { Text } = Typography;

const roleLabel = (roleId: number): string | null => {
  if (roleId === 1) return "Super Admin";
  if (roleId === 2) return "Admin";
  if (roleId === 3) return "Employee";
  return null;
};

/* ---------- field + section primitives ---------- */

const DetailField = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
}) => (
  <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
    <span
      style={{
        width: 34,
        height: 34,
        borderRadius: 9,
        background: LINE_SOFT,
        color: "#98A2B3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 15,
      }}
    >
      {icon}
    </span>
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "#98A2B3",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, color: "#101828", fontWeight: 500, wordBreak: "break-word" }}>
        {value || <span style={{ color: "#98A2B3", fontWeight: 400 }}>N/A</span>}
      </div>
    </div>
  </div>
);

const Section = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div style={{ border: `1px solid ${LINE}`, borderRadius: 12, background: "#fff", padding: 20 }}>
    {title && (
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "#98A2B3",
          marginBottom: 16,
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

const FieldGrid = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px 28px",
    }}
  >
    {children}
  </div>
);

const fmtDate = (d?: string) => (d ? dayjs(d).format("DD MMM YYYY") : undefined);

const metaChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 11px",
  borderRadius: 8,
  background: "#fff",
  border: `1px solid ${LINE}`,
  fontSize: 12.5,
  color: "#475467",
  fontWeight: 500,
};

const quickAction: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "#fff",
  border: `1px solid ${LINE}`,
  color: BRAND,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
};

/* ---------- Main ---------- */

const EmployeeDetails = ({ employee }: { employee: IEmployee }) => {
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [assignToAdmin, { isSuccess }] = useEmployeeAssignToAdminMutation();
  const [buildings, setBuildings] = useState<{ value: number; label: string }[]>([]);
  const [buildingId, setBuildingId] = useState<number[] | typeof skipToken>(skipToken);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Queries
  useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });
  const { data: locationData, isLoading: locationLoading } =
    useGetBuildingWiseLocationQuery(buildingId);

  // Mutation
  const [updateSeatingLocation, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateEmployeeSeatingLocationMutation();

  const handleUnitChange = (unitId: number) => {
    const selectedUnit = unitData?.data?.find((u: any) => u.id === unitId);
    if (selectedUnit) {
      setBuildings(
        selectedUnit.building?.map((b: any) => ({ value: b.id, label: b.name })) || []
      );
    } else {
      setBuildings([]);
    }
    setBuildingId(skipToken);
    form.setFieldsValue({ building_id: undefined, seating_location: undefined });
  };

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
    seating_location_name,
    building_name,
  } = employee || {};

  useEffect(() => {
    if (isSuccess) dispatch(setCommonModal());
  }, [isSuccess, dispatch]);

  useEffect(() => {
    if (updateSuccess) dispatch(setCommonModal());
  }, [updateSuccess, dispatch]);

  useEffect(() => {
    setIsEditingLocation(false);
    form.resetFields();
    setBuildings([]);
    setBuildingId(skipToken);
  }, [employee?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = status === 1;
  const role = roleLabel(role_id);
  const color = getAvatarColor(name || employee_id);

  const items = [
    {
      key: "1",
      label: "Overview",
      children: (
        <Section title="Personal Information">
          <FieldGrid>
            <DetailField icon={<ContactsOutlined />} label="Full Name" value={name} />
            <DetailField icon={<IdcardOutlined />} label="Employee ID" value={employee_id} />
            <DetailField
              icon={<MailOutlined />}
              label="Email"
              value={email ? <a href={`mailto:${email}`}>{email}</a> : undefined}
            />
            <DetailField
              icon={<PhoneOutlined />}
              label="Contact No"
              value={contact_no ? <a href={`tel:${contact_no}`}>{contact_no}</a> : undefined}
            />
            <DetailField
              icon={<SafetyCertificateOutlined />}
              label="Blood Group"
              value={blood_group ? <Tag color="red">{blood_group}</Tag> : undefined}
            />
            <DetailField icon={<CalendarOutlined />} label="Date of Birth" value={fmtDate(date_of_birth)} />
            <DetailField icon={<CrownOutlined />} label="Grade" value={grade} />
            <DetailField
              icon={<SafetyCertificateOutlined />}
              label="Status"
              value={isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
            />
          </FieldGrid>
        </Section>
      ),
    },
    {
      key: "2",
      label: "Work",
      children: (
        <Section title="Employment Details">
          <FieldGrid>
            <DetailField icon={<CrownOutlined />} label="Designation" value={designation} />
            <DetailField icon={<ApartmentOutlined />} label="Department" value={department} />
            <DetailField icon={<BankOutlined />} label="Payroll Unit" value={unit_name} />
            <DetailField icon={<EnvironmentOutlined />} label="Location" value={location} />
            <DetailField icon={<CalendarOutlined />} label="Joining Date" value={fmtDate(joining_date)} />
            <DetailField icon={<ApartmentOutlined />} label="Business Type" value={business_type} />
            <DetailField icon={<ApartmentOutlined />} label="Line of Business" value={line_of_business} />
            <DetailField icon={<PushpinOutlined />} label="PABX" value={pabx} />
            <DetailField icon={<TeamOutlined />} label="Line Manager" value={line_manager_name} />
            <DetailField icon={<IdcardOutlined />} label="Line Manager Emp. ID" value={line_manager_id} />
          </FieldGrid>
        </Section>
      ),
    },
    ...(roleId !== 3
      ? [
          {
            key: "5",
            label: "Seating",
            children: (
              <Section title="Seating Location">
                <div style={{ marginBottom: 16 }}>
                  <DetailField
                    icon={<EnvironmentOutlined />}
                    label="Current Seat"
                    value={
                      seating_location_name
                        ? `${seating_location_name} (${building_name || "N/A"})`
                        : undefined
                    }
                  />
                </div>

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
                      } catch (err: any) {
                        message.error(err?.data?.message || "Failed to update seating location");
                      }
                    }}
                  >
                    <Space direction="vertical" style={{ width: "100%", marginTop: 4 }}>
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
                        <Button type="primary" htmlType="submit" loading={updateLoading}>
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
              </Section>
            ),
          },
        ]
      : []),
    ...(roleId !== 3
      ? [
          {
            key: "3",
            label: "Licenses",
            children: (
              <Section title="Assigned Licenses">
                {licenses?.length ? (
                  <Space size={[8, 8]} wrap>
                    {licenses.map((item) => (
                      <Tag
                        key={item.id}
                        color="blue"
                        style={{ borderRadius: 999, padding: "4px 12px", fontSize: 13 }}
                      >
                        {item?.title}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Licenses Assigned" />
                )}
              </Section>
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
              <Section title="Admin Control">
                <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                  Promote this employee to an administrator. This grants elevated access across the
                  system.
                </Text>
                <Popconfirm
                  title="Assign to admin"
                  description="Are you sure to assign this employee as an admin?"
                  onConfirm={() => assignToAdmin(id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" icon={<CrownOutlined />}>
                    Confirm Admin
                  </Button>
                </Popconfirm>
              </Section>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* HEADER BAND */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: color.bg,
          border: `1px solid ${LINE}`,
          padding: 22,
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: "100%", background: color.fg }} />
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {/* Avatar tile */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
            style={{
              width: 66,
              height: 66,
              borderRadius: 16,
              background: avatarGradient(color),
              border: "3px solid #fff",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 680,
              fontSize: 22,
              flexShrink: 0,
              boxShadow: `0 6px 16px ${color.fg}45`,
            }}
          >
            {getInitials(name)}
          </motion.div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, fontWeight: 680, color: "#101828" }}>{name || "—"}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: "#fff",
                  border: `1px solid ${isActive ? "#BBF7D0" : LINE}`,
                  fontSize: 12,
                  fontWeight: 600,
                  color: isActive ? "#16A34A" : "#667085",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: isActive ? "#16A34A" : "#98A2B3",
                  }}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div style={{ fontSize: 14, color: "#475467", marginTop: 3 }}>
              {designation || "—"}
              {department ? ` · ${department}` : ""}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <span style={metaChip}>
                <IdcardOutlined /> {employee_id || "—"}
              </span>
              {unit_name && (
                <span style={metaChip}>
                  <BankOutlined /> {unit_name}
                </span>
              )}
              {role && (
                <span style={metaChip}>
                  <CrownOutlined /> {role}
                </span>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: 8 }}>
            {contact_no && (
              <a href={`tel:${contact_no}`} style={quickAction} title="Call">
                <PhoneOutlined />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} style={quickAction} title="Email">
                <MailOutlined />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <Tabs defaultActiveKey="1" type="line" items={items} />
    </div>
  );
};

export default EmployeeDetails;
