import { Button, Popconfirm, Space, Switch } from "antd";
import { TableProps } from "antd/lib";
import { ICategoryList } from "../types/categoryTypes";
import dayjs from "dayjs";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
} from "../api/categoryEndPoint";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import UpdateCategory from "../components/UpdateCategory";

export const CategoryTableColumns =
  (): TableProps<ICategoryList>["columns"] => {
    const [deleteCategory] = useDeleteCategoryMutation();
    const [updateStatus] = useUpdateCategoryStatusMutation();
    const dispatch = useDispatch();
    const confirm = (id: number) => {
      if (id) {
        deleteCategory(id);
      }
    };
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },

      {
        title: "Category Name",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Status",
        key: "status",
        render: (record) => (
          <>
            <Switch
              defaultChecked={record.status === "active" ? true : false}
              style={{
                background: record.status === "active" ? "green" : "red",
              }}
              onChange={() => updateStatus(record.id)}
            />
          </>
        ),
      },
      {
        title: "Created Date",
        dataIndex: "created_at",
        key: "created_at",
        render: (created_at) => dayjs(created_at).format("DD-MM-YYYY"),
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
                    title: "Update Category",
                    content: <UpdateCategory single={record} />,
                    show: true,
                    width: 400,
                  })
                );
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the category"
              description="Are you sure to delete this category?"
              onConfirm={() => confirm(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" style={{ color: "red" }}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
  };
