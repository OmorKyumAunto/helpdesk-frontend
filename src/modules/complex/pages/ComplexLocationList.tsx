import { Card, Input, Select, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetComplexLocationsQuery } from "../api/complexlocationEndPoint";
import { ComplexLocationTableColumns } from "../utils/ComplexLocationTableColumns";
import CreateComplexLocation from "../components/CreateComplexLocation";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IComplexLocationParams } from "../types/complexlocationTypes";
import { SearchOutlined } from "@ant-design/icons";
import { generatePagination } from "../../../common/TablePagination copy";

const ComplexLocationList = () => {
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });

  // ✅ URL-based pagination sync
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 50);
  const skipValue = (page - 1) * pageSize;

  // ✅ Filter params for API
  const [filter, setFilter] = useState<IComplexLocationParams>({
    limit: pageSize,
    offset: skipValue,
  });

  // ✅ Always use functional update to prevent stale filter
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      limit: pageSize,
      offset: skipValue,
    }));
  }, [page, pageSize]);

  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data, isLoading, isFetching } = useGetComplexLocationsQuery(filter);

  return (
    <Card
      title="Complex Location List"
      style={{
        boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
        marginBottom: "1rem",
      }}
    >
      {/* -------- Filter Section -------- */}
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "12px",
        }}
      >
        <Input
          style={{ width: 180 }}
          prefix={<SearchOutlined />}
          placeholder="Search..."
          onChange={(e) => {
            const value = e.target.value;
            setSearchParams({ page: "1", pageSize: String(pageSize) });
            setFilter((prev) => ({ ...prev, key: value, offset: 0 }));
          }}
        />

        <Select
          style={{ width: 180, marginBottom: 8 }}
          loading={unitIsLoading}
          placeholder="Select Unit Name"
          showSearch
          optionFilterProp="children"
          allowClear
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={unitData?.data?.map((unit: any) => ({
            value: unit.id,
            label: unit.title,
          }))}
          onChange={(value) => {
            setSearchParams({ page: "1", pageSize: String(pageSize) });
            setFilter((prev) => ({ ...prev, unit_id: value, offset: 0 }));
          }}
        />

        <CreateButton
          name="Create Complex Location"
          onClick={() =>
            dispatch(
              setCommonModal({
                title: "Create Complex Location",
                content: <CreateComplexLocation />,
                show: true,
                width: 500,
              })
            )
          }
        />
      </div>

      {/* -------- Table Section -------- */}
      <Table
        rowKey="id"
        size="small"
        bordered
        loading={isLoading || isFetching}
        dataSource={data?.data ?? []}
        columns={ComplexLocationTableColumns()}
        scroll={{ x: true }}
        pagination={{
          ...generatePagination(
            Number(data?.count || 0),
            setPagination,
            pagination
          ),
          current: page,
          showSizeChanger: true,
          defaultPageSize: 50,
          pageSizeOptions: ["50", "100", "200", "300", "500", "1000"],
          total: data?.count || 0, // ✅ Fixed count mapping
          showTotal: (total, range) =>
            `Showing ${range[0]}–${range[1]} of ${total} entries`,
        }}
        onChange={(pagination) => {
          const current = pagination.current || 1;
          const size = pagination.pageSize || 50;

          setSearchParams({
            page: String(current),
            pageSize: String(size),
          });

          setFilter((prev) => ({
            ...prev,
            offset: (current - 1) * size,
            limit: size,
          }));
        }}
      />
    </Card>
  );
};

export default ComplexLocationList;
