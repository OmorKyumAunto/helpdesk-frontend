import { Card, Table } from "antd";
import { useGetAssignCategoryListQuery } from "../api/assignCategoryEndPoint";
import { AssignCategoryTableColumns } from "../utils/AssignCategoryTableColumns";

const AssignCategoryList = () => {
  const { data, isLoading, isFetching } = useGetAssignCategoryListQuery({});

  return (
    <>
      <div>
        <Card
          title={`Assign Category List`}
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
            marginBottom: "1rem",
          }}
        >
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching}
              dataSource={data?.data?.length ? data.data : []}
              columns={AssignCategoryTableColumns()}
              scroll={{ x: true }}
              pagination={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default AssignCategoryList;
