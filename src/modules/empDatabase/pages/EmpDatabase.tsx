import {
  Button,
  Card,
  DatePicker,
  Popconfirm,
  Select,
  Spin,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PlusOutlined } from "@ant-design/icons";
import { rangePreset } from "../../../common/rangePreset";
import { generatePagination } from "../../../common/TablePagination copy";
import {
  useCreateSyncDataMutation,
  useGetLogHistoryQuery,
} from "../api/empDatabaseEndPoint";
import { ILogHistoryParams } from "../types/empDatabase";
import { EmbDatabaseTableColumns } from "../utils/empDatabaseTableColumns";

const EmpDatabase = () => {
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

  const [filter, setFilter] = useState<ILogHistoryParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter({
      ...filter,
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);

  const { data, isLoading, isFetching } = useGetLogHistoryQuery({ ...filter });
  const [fetchData, { isLoading: fetchLoader }] = useCreateSyncDataMutation();
  return (
    <>
      <div>
        <Card
          title={`Fetch Employee Data ${isFetching ? <Spin /> : ""}`}
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
            {/* <div>
              <Input
                style={{ width: "180px" }}
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilter({ ...filter, key: e.target.value, offset: 0 })
                }
                placeholder="Search..."
              />
            </div> */}
            <Select
              style={{ width: "180px", marginBottom: 8 }}
              placeholder="Select Status"
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                setFilter({ ...filter, status: e, offset: 0 });
              }}
              filterOption={(
                input: string,
                option?: { label: string; value: string }
              ) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  label: "Success",
                  value: "success",
                },
                {
                  label: "Failed",
                  value: "failed",
                },
              ]}
              allowClear
            />
            <Select
              style={{ width: "180px", marginBottom: 8 }}
              placeholder="Select Operation Method"
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                setFilter({ ...filter, operation_method: e, offset: 0 });
              }}
              filterOption={(
                input: string,
                option?: { label: string; value: string }
              ) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  label: "Manual",
                  value: "manual",
                },
                {
                  label: "Auto",
                  value: "auto",
                },
              ]}
              allowClear
            />
            <div>
              <DatePicker.RangePicker
                presets={rangePreset}
                onChange={(_, e) =>
                  setFilter({
                    ...filter,
                    from_date: e[0],
                    to_date: e[1],
                    offset: 0,
                  })
                }
              />
            </div>

            <Popconfirm
              title="Fetch the data"
              description="Are you sure to fetch the data?"
              onConfirm={() => fetchData()}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Fetch Data
              </Button>
            </Popconfirm>
          </div>
          <div>
            <Table
              rowKey={"id"}
              size="small"
              bordered
              loading={isLoading || isFetching || fetchLoader}
              dataSource={data?.data?.length ? data.data : []}
              columns={EmbDatabaseTableColumns()}
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
                pageSizeOptions: ["50", "100", "200", "300", "500", "1000"],
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
                    ((pagination.current || 1) - 1) *
                    (pagination.pageSize || 50),
                  limit: pagination.pageSize!,
                });
              }}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmpDatabase;
