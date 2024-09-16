import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { IAdmin } from "../types/adminTypes";
import { Button, Popconfirm, Space, Switch } from "antd";
import { useDemoteToAdminMutation } from "../api/adminEndPoint";
export const AdminTableColumns = (): TableProps<IAdmin>["columns"] => {
  const [demote] = useDemoteToAdminMutation();

  return [
    {
      title: "Admin ID",
      dataIndex: "employee_id",
      key: "employee_id",
    },

    {
      title: "Admin Name",
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
          <>
            {/* <Switch
              defaultChecked={record.status === 1 ? true : false}
              unCheckedChildren="Inactive"
              checkedChildren="Active"
              onChange={() => updateStatus(record.id)}
            /> */}

            <Popconfirm
              title="Remove the admin"
              description="Are you sure to remove this admin?"
              onConfirm={() => demote(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="primary" danger>
                Remove
              </Button>
            </Popconfirm>
          </>
        </Space>
      ),
    },
  ];
};
