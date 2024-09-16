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
            style={{ color: "#1775BB" }}
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
                <Button style={{ color: "red" }} size="small">
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
            // <p style={{ color: "green", fontWeight: "bold", fontSize: "15px" }}>
            //   Super Admin
            // </p>
            <Button style={{ color: "green" }} size="small">
              Super Admin
            </Button>
          )}
          {record.role_id === 2 && (
            // <p
            //   style={{ color: "orange", fontWeight: "bold", fontSize: "15px" }}
            // >
            //   Admin
            // </p>
            <Button style={{ color: "orange" }} size="small">
              Admin
            </Button>
          )}
          {record.role_id === 3 && (
            // <p
            //   className="rounded border-solid border-1 border-gray-300"
            //   style={{
            //     color: "purple",
            //     fontWeight: "bold",
            //     fontSize: "15px",
            //     // border:'1px solid gray'
            //   }}
            // >
            //   Employee
            // </p>
            <Button style={{ color: "purple" }} size="small">
              Employee
            </Button>
          )}
          {/* {record.role_id === 1 && <Tag color="green-inverse">Super Admin</Tag>}
          {record.role_id === 2 && <Tag color="orange-inverse">Admin</Tag>}
          {record.role_id === 3 && <Tag color="purple-inverse">Employee</Tag>} */}
        </>
      ),
    },
  ];
};
