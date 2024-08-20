import { Space, Tag } from "antd";

// import { DeleteIcon } from "../../../../common/icon/Icon";
import { TableProps } from "antd/lib";
import { IEmployee } from "../types/employeeTypes";
import dayjs from "dayjs";
import { useDeleteEmployeeMutation } from "../api/employeeEndPoint";
import { CustomLink } from "../../../common/CustomLink";
import { DeleteIcon, EyeIcon } from "../../../common/CommonButton";
// import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
export const EmployeeTableColumns = (): TableProps<IEmployee>["columns"] => {
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const confirm = (id: number) => {
    if (id) {
      deleteEmployee(id);
    }
  };
  return [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      //   render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "Code",
    //   dataIndex: "code",
    //   key: "code",
    // },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Phone ",
      dataIndex: "phone_number",
      key: "phone_number",
    },

    {
      title: "Joining Date",
      dataIndex: "joining_date",
      key: "joining_date",
      render: (joining_date) => dayjs(joining_date).format("DD-MM-YYYY"),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"}>
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <CustomLink to={`${record?.id}`}>
            <EyeIcon />
          </CustomLink>

          {/* <CommonTooltip title={"History"}>
            <Button size="small" type="primary">
              History
            </Button>
          </CommonTooltip> */}
          <DeleteIcon
            title={"Delete employee"}
            onConfirm={() => confirm(record?.id)}
          />
        </Space>
      ),
    },
  ];
};
