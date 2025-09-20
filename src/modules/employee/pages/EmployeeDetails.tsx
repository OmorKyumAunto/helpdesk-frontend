import { Button, Card, Col, Popconfirm, Row, Tabs, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import { useEmployeeAssignToAdminMutation } from "../api/employeeEndPoint";
import { IEmployee } from "../types/employeeTypes";

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
  const [assignToAdmin, { isSuccess }] = useEmployeeAssignToAdminMutation();

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
  } = employee || {};

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
    }
  }, [isSuccess, dispatch]);

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
    {
      key: "5",
      label: "Seating Location",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card>
              <FieldItem
                label="Seating Location"
                value={"N/A"}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
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
