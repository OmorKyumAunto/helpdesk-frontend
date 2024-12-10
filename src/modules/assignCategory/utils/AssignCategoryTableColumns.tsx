import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import { IAssignCategoryList } from "../types/assignCategoryTypes";
import dayjs from "dayjs";
// import {
//   useDeleteCategoryMutation,
//   useUpdateCategoryStatusMutation,
// } from "../api/assignCategoryEndPoint";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import AssignUnitToAdmin from "../../admin/components/AssignUnitToAdmin";
import AssignCategoryToAdmin from "../components/AssignCategoryToAdmin";
// import UpdateCategory from "../components/UpdateUpdateCategory";

export const AssignCategoryTableColumns =
  (): TableProps<IAssignCategoryList>["columns"] => {
    // const [deleteCategory] = useDeleteCategoryMutation();
    // const [updateStatus] = useUpdateCategoryStatusMutation();
    const dispatch = useDispatch();
    // const confirm = (id: number) => {
    //   if (id) {
    //     deleteCategory(id);
    //   }
    // };
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },

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
        title: "Actions",
        key: "action",
        render: (record: IAssignCategoryList) => (
          <Space size="middle">
            {/* <Button
              size="small"
              style={{ color: "#1775BB" }}
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Update Category",
                    content: <UpdateCategory single={record} />,
                    show: true,
                    width: 400,
                  })
                );
              }}
            >
              <EditOutlined />
            </Button> */}
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
                        searchAccess={record}
                      />
                    ),
                    show: true,
                  })
                );
              }}
            >
              Assign Category
            </Button>
            {/* <Popconfirm
              title="Delete the category"
              description="Are you sure to delete this category?"
              onConfirm={() => confirm(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" style={{ color: "red" }}>
                <DeleteOutlined />
              </Button>
            </Popconfirm> */}
          </Space>
        ),
      },
    ];
  };
