import { Button, Popconfirm, Space, Switch, Tag } from "antd";
import { TableProps } from "antd/lib";
import { IEmployee } from "../types/employeeTypes";
import dayjs from "dayjs";
import {
  useDeleteEmployeeMutation,
  useUpdateEmployeeStatusMutation,
} from "../api/employeeEndPoint";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateEmployee from "../components/UpdateEmployee";
import EmployeeDetails from "../pages/EmployeeDetails";
import { RootState } from "../../../app/store/store";
import { BsTiktok } from "react-icons/bs";

export const EmployeeTableColumns = (): TableProps<IEmployee>["columns"] => {
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const confirm = (id: number) => {
    if (id) {
      deleteEmployee(id);
    }
  };
  return [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },

    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact No",
      dataIndex: "contact_no",
      key: "contact_no",
    },

    {
      title: "Date of Joining",
      dataIndex: "joining_date",
      key: "joining_date",
      render: (joining_date) => dayjs(joining_date).format("DD-MM-YYYY"),
    },
    {
      title: "Unit Name",
      dataIndex: "unit_name",
      key: "unit_name",
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            size="small"
            type="text"
            style={{ color: "#1775BB" }}
            // type="primary"
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Employee Details",
                  content: <EmployeeDetails employee={record} />,
                  show: true,
                  width: 740,
                })
              );
            }}
          >
            <EyeOutlined />
          </Button>
          <Button
            size="small"
            style={{ color: "#1775BB" }}
            // type="primary"
            onClick={() => {
              dispatch(
                setCommonModal({
                  title: "Update Employee",
                  content: <UpdateEmployee employee={record} />,
                  show: true,
                  width: 678,
                })
              );
            }}
          >
            <EditOutlined />
          </Button>
          <>
            <Switch
              defaultChecked={record.status === 1 ? true : false}
              // unCheckedChildren="Inactive"
              // checkedChildren="Active"
              style={{ background: record.status === 1 ? "green" : "red" }}
              onChange={() => updateStatus(record.id)}
            />
          </>
          {roleId === 1 && (
            <>
              <Popconfirm
                title="Delete the employee"
                description="Are you sure to delete this employee?"
                onConfirm={() => confirm(record?.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger size="small" type="primary">
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (record) => (
        <>
          {/* {record.role_id === 1 && <Tag color="green">Super Admin</Tag>}
          {record.role_id === 2 && <Tag color="orange">Admin</Tag>}
          {record.role_id === 3 && <Tag color="purple">Employee</Tag>} */}
          {record.role_id === 1 && (
            <p style={{ color: "green" }}>Super Admin</p>
          )}
          {record.role_id === 2 && <p style={{ color: "orange" }}>Admin</p>}
          {record.role_id === 3 && <p style={{ color: "purple" }}>Employee</p>}
          {/* {record.role_id === 1 && <Tag color="green-inverse">Super Admin</Tag>}
          {record.role_id === 2 && <Tag color="orange-inverse">Admin</Tag>}
          {record.role_id === 3 && <Tag color="purple-inverse">Employee</Tag>} */}
        </>
      ),
    },
  ];
};
