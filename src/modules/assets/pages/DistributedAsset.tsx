import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Select } from "antd";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetAllDistributedAssetQuery } from "../api/assetsEndPoint";
import { DistributedAssetsTableColumns } from "../utils/DistributedTableColumns";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
const { Option } = Select;
const DistributedAsset = () => {
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
  const { data: profile } = useGetMeQuery();
  const { data: locationData, isLoading: locationIsLoading } =
    useGetActiveLocationsQuery({});
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const [filter, setFilter] = useState<any>({
    limit: Number(pageSize),
    offset: skipValue,
  });
  const locationOption = locationData?.data?.filter(
    (item) => item.unit_id === filter.unit
  );

  useEffect(() => {
    setFilter({
      ...filter,
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);
  const { data, isLoading, isFetching } = useGetAllDistributedAssetQuery({
    ...filter,
  });
  return (
    <div>
      <Card
        title={`Distributed Asset List `}
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
          <div>
            <Input
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setFilter({ ...filter, key: e.target.value, offset: 0 })
              }
              placeholder="Search..."
            />
          </div>
          <Select
            style={{ width: "180px" }}
            onChange={(e) =>
              setFilter({ ...filter, employee_type: e, offset: 0 })
            }
            placeholder="Select Type"
          >
            <Option value="">All</Option>
            <Option value={"management"}>Management</Option>
            <Option value={"non-management"}>Non Management</Option>
          </Select>
          <Select
            style={{ width: "180px" }}
            loading={unitIsLoading}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => {
              setFilter({ ...filter, unit: e, offset: 0 });
            }}
            filterOption={(
              input: string,
              option?: { label: string; value: number }
            ) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
          />
          <Select
            style={{ width: "180px" }}
            loading={locationIsLoading}
            placeholder="Select Location"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, location: e, offset: 0 })}
            filterOption={(
              input: string,
              option?: { label: string; value: number }
            ) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={locationOption?.map((location: any) => ({
              value: location.id,
              label: location.location,
            }))}
            allowClear
          />
          <Select
            placeholder="Select Asset Type"
            style={{ width: "180px" }}
            onChange={(e) => setFilter({ ...filter, type: e, offset: 0 })}
            allowClear
          >
            <Option value="Laptop">Laptop</Option>
            <Option value="Desktop">Desktop</Option>
            <Option value="Printer">Printer</Option>
            <Option value="Accessories">Accessories</Option>
          </Select>

          <ExcelDownload
            excelName={"distributed_asset_list"}
            excelTableHead={[
              "Employee ID",
              "Employee Name",
              "Department",
              "Unit",
              "Location",
              "Asset Type",
              "Serial No",
              "Assigning Date",
            ]}
            excelData={
              data?.data?.length
                ? data?.data?.map(
                    ({
                      user_id_no,
                      user_name,
                      department,
                      category,
                      assign_date,
                      serial_number,
                      employee_unit_name,
                      location_name,
                    }: any) => {
                      const data = {
                        "Employee ID": user_id_no,
                        "Employee Name": user_name,
                        Department: department,
                        Unit: employee_unit_name,
                        Location: location_name,
                        "Asset Type": category,
                        "Serial No": serial_number,
                        "Assigning Date":
                          dayjs(assign_date).format("DD-MM-YYYY"),
                      };
                      return data;
                    }
                  )
                : []
            }
          />
        </div>
        <div>
          <Table
            rowKey={"id"}
            size="small"
            bordered
            loading={isLoading || isFetching}
            dataSource={data?.data?.length ? data.data : []}
            columns={DistributedAssetsTableColumns()}
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

export default DistributedAsset;
