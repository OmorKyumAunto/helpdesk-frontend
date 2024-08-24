import { Button, Popconfirm, Space, Tag } from "antd";

// import { DeleteIcon } from "../../../../common/icon/Icon";
import { TableProps } from "antd/lib";
import { IEmployee } from "../types/employeeTypes";
import dayjs from "dayjs";
import { useDeleteEmployeeMutation } from "../api/employeeEndPoint";
import { CustomLink } from "../../../common/CustomLink";
import { DeleteIcon, EditButton, EyeIcon } from "../../../common/CommonButton";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateEmployee from "../components/UpdateEmployee";
import EmployeeDetails from "../pages/EmployeeDetails";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
export const EmployeeTableColumns = (): TableProps<IEmployee>["columns"] => {
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const dispatch = useDispatch();
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
            type="primary"
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
            type="primary"
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
        </Space>
      ),
    },
  ];
};
