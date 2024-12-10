import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import { useGetCategoryListQuery } from "../api/categoryEndPoint";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CategoryTableColumns } from "../utils/CategoryTableColumns";
import { CreateButton } from "../../../common/CommonButton";
import CreateCategory from "../components/CreateCategory";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isFetching } = useGetCategoryListQuery({});

  return (
    <>
      <div>
        <Card
          title={`Category List`}
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
              name="Create Category"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create Category",
                    content: <CreateCategory />,
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
              columns={CategoryTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default CategoryList;
