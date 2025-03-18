import { DeleteOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Popconfirm, Table, Tag } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDeleteSubTaskCategoryMutation } from "../api/taskCategoryEndPoint";
import { ITaskCategoryList } from "../types/taskConfigTypes";

const CategoryView = ({ record }: { record: ITaskCategoryList }) => {
  const dispatch = useDispatch();
  const [remove, { isSuccess }] = useDeleteSubTaskCategoryMutation();
  const { title, status, format, set_time, tsc } = record || {};
  useEffect(() => {
    if (isSuccess) {
      dispatch(setCommonModal());
    }
  }, [isSuccess, dispatch]);
  return (
    <div>
      <Descriptions
        size="middle"
        bordered
        column={{ sm: 1, md: 2 }}
        items={[
          {
            key: "1",
            label: "Category Title",
            children: title,
            span: 2,
          },
          {
            key: "2",
            label: "Time",
            children: `${set_time} ${format}`,
            span: 2,
          },
          {
            key: "3",
            label: "Status",
            children:
              status === 1 ? (
                <Tag color="green-inverse">ACTIVE</Tag>
              ) : (
                <Tag color="red-inverse">INACTIVE</Tag>
              ),
            span: 2,
          },
        ]}
      />
      <Divider>Sub Category List</Divider>
      <Table
        bordered
        size="small"
        dataSource={tsc}
        pagination={false}
        columns={[
          {
            title: "Serial No",
            render: (_, __, index) => index + 1,
          },
          {
            key: "1",
            title: "Title",
            dataIndex: "title",
          },
          {
            key: "2",
            title: "Delete",
            render: (record) => (
              <Popconfirm
                title="Delete the task sub category"
                description="Are you sure to delete this task sub category?"
                onConfirm={() => remove(record?.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" style={{ color: "red" }}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CategoryView;
