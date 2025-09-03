import { Button, Popconfirm, Space, Tag } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDemoteToEmployeeMutation, useDemoteToUnitAdminMutation, usePromoteToSuperAdminMutation } from "../api/adminEndPoint";
import AssignUnitToAdmin from "../components/AssignUnitToAdmin";
import AssignCategoryToAdmin from "../../assignCategory/components/AssignCategoryToAdmin";
import AssignLocationToAdmin from "../components/AssignLocationToAdmin";
import { IAdmin } from "../types/adminTypes";
export const UnitAdminTableColumns = (): TableProps<IAdmin>["columns"] => {
  const dispatch = useDispatch();
  const [demote] = useDemoteToEmployeeMutation();
  const [promoteSuperAdmin] = usePromoteToSuperAdminMutation();
  const [demoteToUnitAdmin] = useDemoteToUnitAdminMutation();


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

    // {
    //   title: "Date of Joining",
    //   dataIndex: "joining_date",
    //   key: "joining_date",
    //   render: (joining_date) => dayjs(joining_date).format("DD-MM-YYYY"),
    // },
    // {
    //   title: "Location",
    //   dataIndex: "unit_name",
    //   key: "unit_name",
    // },
    {
        title: "Asset Units",
        dataIndex: "asset_unit_titles",
        key: "asset_unit_titles",
      },
      {
        title: "Ticket Categories",
        dataIndex: "ticket_category_titles",
        key: "ticket_category_titles",
      },
    {
      title: "Role",
      key: "role",
      render: (record) => (
        <>
          {record.role_id === 1 && <Tag color="green">Super Admin</Tag>}
          {record.role_id === 2 && <Tag color="orange">Admin</Tag>}
          {record.role_id === 3 && <Tag color="purple">Employee</Tag>}
          {record.role_id === 4 && <Tag color="purple">Unit Super Admin</Tag>}
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <>

            {/* <Button
              size="small"
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Assign Unit",
                    content: (
                      <AssignUnitToAdmin
                        id={record?.id}
                        searchAccess={record?.searchAccess}
                      />
                    ),
                    show: true,
                  })
                );
              }}
            >
              Assign Unit
            </Button> */}
            <Button
              size="small"
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Assign Location",
                    content: (
                      <AssignLocationToAdmin
                        id={record?.id}
                        searchAccess={record?.searchAccess}
                      />
                    ),
                    show: true,
                  })
                );
              }}
            >
              Assign Location
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Assign Category",
                    content: (
                      <AssignCategoryToAdmin
                        id={record?.user_id}
                        assign_category={record?.assign_category}
                      />
                    ),
                    show: true,
                  })
                );
              }}
            >
              Assign Category
            </Button>

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
