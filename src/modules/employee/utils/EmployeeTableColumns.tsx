import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Switch, Tag } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch, useSelector } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { RootState } from "../../../app/store/store";
import {
  useDeleteEmployeeMutation,
  useUpdateEmployeeStatusMutation,
} from "../api/employeeEndPoint";
import UpdateEmployee from "../components/UpdateEmployee";
import EmployeeDetails from "../pages/EmployeeDetails";
import { IEmployee } from "../types/employeeTypes";
import { useGetMeQuery } from "../../../app/api/userApi";

export const EmployeeTableColumns = (): TableProps<IEmployee>["columns"] => {
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const dispatch = useDispatch();
  const { data: profile } = useGetMeQuery();
      const employeeID = profile?.data?.employee_id;
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
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    // },
    // {
    //   title: "Contact No",
    //   dataIndex: "contact_no",
    //   key: "contact_no",
    // },
    {
      title: "PABX",
      dataIndex: "pabx",
      key: "pabx",
    },
    {
      title: "Contact No",
      dataIndex: "contact_no",
      key: "contact_no",
    },

    // {
    //   title: "Date of Joining",
    //   dataIndex: "joining_date",
    //   key: "joining_date",
    //   render: (joining_date) => dayjs(joining_date).format("DD-MM-YYYY"),
    // },
    // {
    //   title: "Payroll Unit",
    //   dataIndex: "unit_name",
    //   key: "unit_name",
    // },
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
          {employeeID !== "Assetteam" && (
            <>
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

              <Switch
                checked={record.status === 1}
                style={{ background: record.status === 1 ? "green" : "red" }}
                onChange={() => updateStatus(record.id)}
              />
            </>
          )}

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
          {record.role_id === 1 && <Tag color="green">Super Admin</Tag>}
          {record.role_id === 2 && <Tag color="orange">Admin</Tag>}
          {record.role_id === 3 && <Tag color="purple">Employee</Tag>}
        </>
      ),
    },
  ];
};
