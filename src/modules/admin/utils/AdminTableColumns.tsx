import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import {
  useAdminAssignToAdminMutation,
  useDeleteAdminMutation,
} from "../api/adminEndPoint";
import { IAdmin } from "../types/adminTypes";

export const AdminTableColumns = (): TableProps<IAdmin>["columns"] => {
  const [deleteAdmin] = useDeleteAdminMutation();
  const [assignToAdmin] = useAdminAssignToAdminMutation();
  const dispatch = useDispatch();
  const { roleId } = useSelector((state: RootState) => state.userSlice);
  const confirm = (id: number) => {
    if (id) {
      deleteAdmin(id);
    }
  };
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
    // {
    //   title: "Actions",
    //   key: "action",
    //   render: (record) => (
    //     <Space size="middle">
    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() => {
    //           dispatch(
    //             setCommonModal({
    //               title: "Admin Details",
    //               content: <AdminDetails Admin={record} />,
    //               show: true,
    //               width: 740,
    //             })
    //           );
    //         }}
    //       >
    //         <EyeOutlined />
    //       </Button>
    //       <Button
    //         size="small"
    //         type="primary"
    //         onClick={() => {
    //           dispatch(
    //             setCommonModal({
    //               title: "Update Admin",
    //               content: <UpdateAdmin Admin={record} />,
    //               show: true,
    //               width: 678,
    //             })
    //           );
    //         }}
    //       >
    //         <EditOutlined />
    //       </Button>
    //       {roleId === 1 && (
    //         <>
    //           <Popconfirm
    //             title="Delete the Admin"
    //             description="Are you sure to delete this Admin?"
    //             onConfirm={() => confirm(record?.id)}
    //             okText="Yes"
    //             cancelText="No"
    //           >
    //             <Button danger size="small" type="primary">
    //               <DeleteOutlined />
    //             </Button>
    //           </Popconfirm>
    //           <Popconfirm
    //             title="Assign to admin"
    //             description="Are you sure to assign this Admin as a admin?"
    //             onConfirm={() => assignToAdmin(record?.id)}
    //             okText="Yes"
    //             cancelText="No"
    //           >
    //             <Button size="small" type="primary">
    //               Make Admin
    //             </Button>
    //           </Popconfirm>
    //         </>
    //       )}
    //     </Space>
    //   ),
    // },
  ];
};
