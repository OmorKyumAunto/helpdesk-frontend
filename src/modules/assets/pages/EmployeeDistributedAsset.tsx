import { Card, Select } from "antd";
import { Table } from "antd/lib";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetMeQuery } from "../../../app/api/userApi";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetEmployeeAllDistributedAssetQuery } from "../api/assetsEndPoint";
import { EmployeeDistributedAssetsTableColumns } from "../utils/EmployeeDistributedTableColumns";
const { Option } = Select;
const EmployeeDistributedAsset = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<any>({
    limit: Number(pageSize),
    offset: skipValue,
  });
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  useEffect(() => {
    setFilter({
      ...filter,
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);
  const { data, isLoading, isFetching } =
    useGetEmployeeAllDistributedAssetQuery({
      ...filter,
    });
  return (
    <div>
      <Card
        title={roleID === 3 ? `Distributed Asset List ` : "My Stock List"}
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
        ></div>
        <div>
          <Table
            rowKey={"id"}
            size="small"
            bordered
            loading={isLoading || isFetching}
            dataSource={data?.data?.length ? data.data : []}
            columns={EmployeeDistributedAssetsTableColumns()}
            scroll={{ x: true }}
            pagination={{
              ...generatePagination(
                Number(data?.total),
                setPagination,
                pagination
              ),
              current: Number(page),
              showSizeChanger: true,
              defaultPageSize: 50,
              pageSizeOptions: ["50", "100", "200", "300", "500"],
              total: data ? Number(data?.total) : 0,
              showTotal: (total) => `Total ${total} `,
            }}
            onChange={(pagination) => {
              setSearchParams({
                page: String(pagination.current),
                pageSize: String(pagination.pageSize),
              });
              setFilter({
                ...filter,
                offset:
                  ((pagination.current || 1) - 1) * (pagination.pageSize || 50),
                limit: pagination.pageSize!,
              });
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDistributedAsset;
