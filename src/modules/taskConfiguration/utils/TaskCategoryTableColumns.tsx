import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag } from "antd";
import { TableProps } from "antd/lib";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import {
  useDeleteSubTaskCategoryMutation,
  useDeleteTaskCategoryMutation,
} from "../api/taskCategoryEndPoint";
import UpdateTaskCategory from "../components/UpdateTaskCategory";
import { ITaskCategoryList } from "../types/taskConfigTypes";
import UpdateTaskSubCategory from "../components/UpdateSubCategory";
import CreateSubTaskCategory from "../components/CreateSubCategory";
import CategoryView from "../pages/CategoryView";

export const TaskCategoryTableColumns =
  (): TableProps<ITaskCategoryList>["columns"] => {
    const [remove] = useDeleteTaskCategoryMutation();
    const dispatch = useDispatch();
    const confirm = (id: number) => {
      if (id) {
        remove(id);
      }
    };
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Time",
        render: (record: ITaskCategoryList) => (
          <span>{`${record.set_time} ${record.format}`} </span>
        ),
      },
      {
        title: "Status",
        key: "status",
        render: (record: ITaskCategoryList) => (
          <>
            <Tag color={record.status === 1 ? "green-inverse" : "red-inverse"}>
              {record.status === 1 ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        ),
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
                    title: "Category Details",
                    content: <CategoryView record={record} />,
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
              style={{ color: "#1775BB" }}
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Update Task Category",
                    content: <UpdateTaskCategory single={record} />,
                    show: true,
                    width: 500,
                  })
                );
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the task category"
              description="Are you sure to delete this task category?"
              onConfirm={() => confirm(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" style={{ color: "red" }}>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
            <Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Add Sub Category",
                    content: <CreateSubTaskCategory record={record} />,
                    show: true,
                    width: 500,
                  })
                );
              }}
            >
              Sub Category
            </Button>
          </Space>
        ),
      },
    ];
  };
export const TaskSubCategoryTableColumns =
  (): TableProps<ITaskCategoryList>["columns"] => {
    const [remove] = useDeleteSubTaskCategoryMutation();
    const dispatch = useDispatch();
    const confirm = (id: number) => {
      if (id) {
        remove(id);
      }
    };
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Time",
        render: (record: ITaskCategoryList) => (
          <span>{`${record.set_time} ${record.format}`} </span>
        ),
      },
      {
        title: "Status",
        key: "status",
        render: (record: ITaskCategoryList) => (
          <>
            <Tag color={record.status === 1 ? "green-inverse" : "red-inverse"}>
              {record.status === 1 ? "ACTIVE" : "INACTIVE"}
            </Tag>
          </>
        ),
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
                    title: "Update Task Sub Category",
                    content: <UpdateTaskSubCategory single={record} />,
                    show: true,
                    width: 500,
                  })
                );
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Delete the task sub category"
              description="Are you sure to delete this task sub category?"
              // onConfirm={() => confirm(record?.id)}
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
