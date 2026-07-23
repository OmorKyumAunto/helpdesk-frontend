import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Dropdown,
  Empty,
  Grid,
  Input,
  Pagination,
  Select,
  Skeleton,
} from "antd";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { startTransition, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetAllDistributedAssetQuery } from "../api/assetsEndPoint";
import { DistributedAssetsTableColumns } from "../utils/DistributedTableColumns";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
import { rangePreset } from "../../../common/rangePreset";
import DistributeAssetDetails from "../components/DistributedAssetDetails";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
import "../assets-ui.css";
import CategoryFilterBar from "../components/CategoryFilterBar";
import DistributedMobileCard from "../components/DistributedMobileCard";
import {
  ASSET_CATEGORIES,
  TOP_DISBURSEMENT_CATEGORIES,
} from "../utils/assetCategories";
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
    profile?.data?.role_id === 2 || profile?.data?.role_id === 4
      ? unitOptionForAdmin
      : unitData?.data;

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
  const { data, isLoading, isFetching } = useGetAllDistributedAssetQuery(
    { ...filter },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );
  useEffect(() => {
    console.log("API Response:", data);
    console.log("Is Loading:", isLoading);
    console.log("Is Fetching:", isFetching);
  }, [data, isLoading, isFetching]);
  const dispatch = useDispatch();

  const openDetails = (id: number) =>
    dispatch(
      setCommonModal({
        title: "Distributed Asset Details",
        content: <DistributeAssetDetails id={id} />,
        show: true,
        width: 740,
      })
    );

  // Single entry point for both the chip rail and the dropdown, so whichever
  // one the user touches leaves the other showing the same thing.
  // MUST be called unconditionally: this builder calls hooks internally
  // (useDispatch / useGetMeQuery / useReturnAssetToStockMutation). Calling it
  // inline inside the table branch below would change the hook count whenever
  // the viewport crosses `md` and the card layout takes over.
  const columns = DistributedAssetsTableColumns();

  // Below `md` the 6-column table is unusable on a phone — switch to cards.
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const rows = isLoading || isFetching ? [] : data?.data?.length ? data.data : [];

  // Marked as a transition — see the matching note in AssetsList.
  const applyCategory = (category?: string) => {
    startTransition(() => {
      setFilter({ ...filter, type: category, offset: 0 });
      setSearchParams({ page: "1", pageSize: String(pageSize) });
    });
  };

  const isInteractive = (target: HTMLElement | null) =>
    !!target?.closest(
      "button, a, input, .asset-actions, .ant-select, .ant-dropdown, .ant-popover, .ant-tooltip"
    );

  return (
    <div className="asset-ui">
      <Card
        title="Distributed Asset List"
        style={{
          boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
          marginBottom: "1rem",
        }}
      >
        <div className="asset-toolbar">
          <div style={{ width: "160px" }}>
            <Input
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setFilter({ ...filter, key: e.target.value, offset: 0 })
              }
              placeholder="Search..."
            />
          </div>
          {/* Full category list — the chip rail below only carries the
              high-volume ones. Controlled so the two stay in sync. */}
          <Select
            placeholder="All Categories"
            style={{ width: "170px" }}
            showSearch
            optionFilterProp="children"
            value={filter.type}
            onChange={(e) => applyCategory(e)}
            filterOption={(input: string, option?: { children?: any }) =>
              String(option?.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            allowClear
          >
            {ASSET_CATEGORIES.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
          <Select
            style={{ width: "160px" }}
            loading={unitIsLoading}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
          <Dropdown
            trigger={["hover"]}
            dropdownRender={() => (
              <div
                style={{
                  padding: 16,
                  background: "#fff",
                  borderRadius: 8,
                  width: "220px",
                  border: "1px solid #f2f2f2",
                }}
              >
                <Select
                  style={{ width: "100%", marginBottom: 8 }}
                  onChange={(e) =>
                    setFilter({ ...filter, employee_type: e, offset: 0 })
                  }
                  placeholder="Employee Type"
                  allowClear
                >
                  <Option value="">All</Option>
                  <Option value="management">Management</Option>
                  <Option value="non-management">Non Management</Option>
                </Select>

                <Select
                  style={{ width: "100%", marginBottom: 8 }}
                  loading={locationIsLoading}
                  placeholder="Select Location"
                  showSearch
                  optionFilterProp="children"
                  onChange={(e) =>
                    setFilter({ ...filter, location: e, offset: 0 })
                  }
                  options={locationOption?.map((location: any) => ({
                    value: location.id,
                    label: location.location,
                  }))}
                  allowClear
                />

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
            )}
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Dropdown>
          <div>
            <ExcelDownload
              excelName="distributed_asset_list"
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
                      return {
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
                    }
                  )
                  : []
              }
            />
          </div>
        </div>

        <CategoryFilterBar
          value={filter.type}
          categories={TOP_DISBURSEMENT_CATEGORIES}
          onChange={applyCategory}
        />

        <div>
          {isMobile ? (
            /* --- Card layout for phones/small tablets --- */
            <div style={{ display: "grid", gap: 12 }}>
              {isLoading || isFetching ? (
                [1, 2, 3].map((i) => (
                  <div className="asset-card" key={i}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))
              ) : rows.length ? (
                rows.map((record: any) => (
                  <DistributedMobileCard key={record.id} record={record} />
                ))
              ) : (
                <Empty description="No distributed assets found" />
              )}

              <Pagination
                style={{ marginTop: 8 }}
                align="center"
                size="small"
                current={Number(page)}
                pageSize={Number(pageSize)}
                total={Number(data?.total) || 0}
                showSizeChanger
                pageSizeOptions={["25", "50", "100", "200"]}
                showTotal={(total) => `Total ${total}`}
                onChange={(current, size) => {
                  setSearchParams({
                    page: String(current),
                    pageSize: String(size),
                  });
                  setFilter({
                    ...filter,
                    offset: (current - 1) * size,
                    limit: size,
                  });
                }}
              />
            </div>
          ) : (
          <Table
            rowKey="id"
            size="small"
            bordered
            className="asset-table"
            sticky
            rowClassName={() => "asset-row"}
            onRow={(record: any) => ({
              onClick: (event: any) => {
                if (isInteractive(event.target as HTMLElement)) return;
                openDetails(record.id);
              },
            })}
            loading={isLoading || isFetching}
            dataSource={
              isLoading || isFetching
                ? [] // Show empty while loading
                : (data?.data?.length ? data.data : [])
            }
            columns={columns}
            scroll={{ x: "max-content" }}
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
          )}
        </div>
      </Card>
    </div>
  );
};

export default DistributedAsset;
