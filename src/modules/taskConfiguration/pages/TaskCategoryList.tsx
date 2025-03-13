import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetTaskCategoryQuery } from "../api/taskCategoryEndPoint";
import CreateTaskCategory from "../components/CreateTaskCategory";
import { TaskCategoryTableColumns } from "../utils/TaskCategoryTableColumns";

const TaskCategoryList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetTaskCategoryQuery();

  return (
    <>
      <div>
        <Card
          title={`Task Category List`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: "12px",
            }}
          >
            <CreateButton
              name="Create New Category"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create New Category",
                    content: <CreateTaskCategory />,
                    show: true,
                    width: 500,
                  })
                );
              }}
            />
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={TaskCategoryTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default TaskCategoryList;
