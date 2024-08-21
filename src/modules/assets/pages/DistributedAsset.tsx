import { Card } from "antd";
import { Table } from "antd/lib";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DistributedAssetsTableColumns } from "../utils/DistributedTableColumns";
import { useGetAllDistributedAssetQuery } from "../api/assetsEndPoint";

const DistributedAsset = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "",
    pageSize: "",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "20";
  const offsetValue = Number(page) * Number(pageSize);
  const [filter, setFilter] = useState<any>({
    limit: 20,
    offset: offsetValue - 20,
  });
  const { data, isLoading } = useGetAllDistributedAssetQuery({ ...filter });
  return (
    <div>
      <Card
        title={`Distributed Asset List `}
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
            loading={isLoading}
            dataSource={data?.data?.length ? data.data : []}
            columns={DistributedAssetsTableColumns()}
            scroll={{ x: true }}
            onChange={(pagination) => {
              setSearchParams({
                page: String(pagination.current),
                pageSize: String(pagination.pageSize),
              });
              setFilter({
                ...filter,
                offset:
                  ((pagination.current || 1) - 1) * (pagination.pageSize || 20),
                limit: pagination.pageSize!,
              });
            }}
            // pagination={
            //   Number(data?.total) !== undefined && Number(data?.total) > 20
            //     ? {
            //         ...tablePagination,
            //         current: Number(page),
            //       }
            //     : false
            // }
          />
        </div>
      </Card>
    </div>
  );
};

export default DistributedAsset;
