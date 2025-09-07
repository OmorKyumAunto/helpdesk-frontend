import { Button, Popconfirm, Space, Tag } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDemoteToEmployeeMutation, useDemoteToUnitAdminMutation, usePromoteToSuperAdminMutation } from "../api/adminEndPoint";
import AssignUnitToAdmin from "../components/AssignUnitToAdmin";
import AssignLocationToAdmin from "../components/AssignLocationToAdmin";
import { IAdmin } from "../types/adminTypes";
import { useGetMeQuery } from "../../../app/api/userApi";
export const AdminTableColumns = (): TableProps<IAdmin>["columns"] => {
  const dispatch = useDispatch();
  const [demote] = useDemoteToEmployeeMutation();
  const [promoteSuperAdmin] = usePromoteToSuperAdminMutation();
  const [demoteToUnitAdmin] = useDemoteToUnitAdminMutation();
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

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
            {/* Hide Assign Unit for roleID 4 */}
            {roleID !== 4 && (
              <Button
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
              </Button>
            )}

            {/* Hide Assign Location for roleID 1 */}
            {/* Assign Location button */}
            {roleID !== 1 && (!record.seating_location || record.seating_location.length === 0) && (
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
                        />
                      ),
                      show: true,
                    })
                  );
                }}
              >
                Assign Location
              </Button>
            )}


            {/* Hide Promote to Unit Super Admin for roleID 4 */}
            {roleID !== 4 && (
              <Popconfirm
                title="Promote to Unit Super Admin"
                description="Are you sure to promote to Unit Superadmin?"
                onConfirm={() => promoteSuperAdmin(record?.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" type="primary">
                  Promote
                </Button>
              </Popconfirm>
            )}
            {roleID === 1 && (
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
            )}

          </>
        </Space>
      ),
    }

  ];
};
