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

export const EmployeeTableColumnsForEmployeePanel =
  (): TableProps<IEmployee>["columns"] => {
    const dispatch = useDispatch();
    const { roleId } = useSelector((state: RootState) => state.userSlice);

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
          </Space>
        ),
      },
    ];
  };
