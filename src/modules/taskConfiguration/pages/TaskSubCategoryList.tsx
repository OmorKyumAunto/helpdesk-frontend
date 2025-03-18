import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetTaskCategoryQuery } from "../api/taskCategoryEndPoint";
import CreateSubTaskCategory from "../components/CreateSubCategory";
import { TaskSubCategoryTableColumns } from "../utils/TaskCategoryTableColumns";

const TaskSubCategoryList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetTaskCategoryQuery();

  return (
    <>
      <div>
        <Card
          title={`Task Sub Category List`}
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
              name="Create Sub Category"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create Sub Category",
                    // content: <CreateSubTaskCategory />,
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
              columns={TaskSubCategoryTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default TaskSubCategoryList;
