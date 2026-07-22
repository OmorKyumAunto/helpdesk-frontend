import { Card, Input, Select, Table } from "antd";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { CreateButton } from "../../../common/CommonButton";
import { useGetLocationsQuery } from "../api/locationEndPoint";
import { LocationTableColumns } from "../utils/LocationTableColumns";
import CreateLocation from "../components/CreateLocation";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ILocationParams } from "../types/locationTypes";
import { SearchOutlined } from "@ant-design/icons";
import { generatePagination } from "../../../common/TablePagination copy";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { useGetMeQuery } from "../../../app/api/userApi";

const LocationList = () => {
  const dispatch = useDispatch();
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

  const [filter, setFilter] = useState<ILocationParams>({
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

  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const { data: profile } = useGetMeQuery();
  // Unit Super Admin (role 4) may only see the units granted in searchAccess.
  const isUnitSuperAdmin = profile?.data?.role_id === 4;
  const accessUnitIds: number[] =
    profile?.data?.searchAccess?.map((item: any) => item?.unit_id) ?? [];

  // Restrict the unit dropdown to the units they can access.
  const unitOption = isUnitSuperAdmin
    ? unitData?.data?.filter((unit: any) => accessUnitIds.includes(unit?.id))
    : unitData?.data;

  // Scope the list itself: when no specific unit is picked, fall back to ALL
  // of their accessible units. "-1" guarantees an empty result if they have none.
  const scopedUnit = isUnitSuperAdmin
    ? filter.unit ?? (accessUnitIds.length ? accessUnitIds.join(",") : "-1")
    : filter.unit;

  const { data, isLoading, isFetching } = useGetLocationsQuery({
    ...filter,
    unit: scopedUnit,
  });

  return (
    <>
      <div>
        <Card
          title={`Sub Unit List`}
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
                style={{ width: "180px" }}
                prefix={<SearchOutlined />}
                onChange={(e) =>
                  setFilter({ ...filter, key: e.target.value, offset: 0 })
                }
                placeholder="Search..."
              />
            </div>
            <Select
              style={{ width: "180px", marginBottom: 8 }}
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={unitOption?.map((unit: any) => ({
                value: unit.id,
                label: unit.title,
              }))}
              allowClear
            />
            <ExcelDownload
              excelName={"sub_unit_list"}
              excelTableHead={["SL", "Sub Unit", "Unit", "Status"]}
              excelData={
                data?.data?.length
                  ? data.data.map((item: any, index: number) => ({
                      SL: index + 1,
                      "Sub Unit": item?.location || "",
                      Unit: item?.unit_name || "",
                      Status: item?.status === 1 ? "Active" : "Inactive",
                    }))
                  : []
              }
            />
            <CreateButton
              name="Create Sub Unit"
              onClick={() => {
                dispatch(
                  setCommonModal({
                    title: "Create Sub Unit",
                    content: <CreateLocation />,
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
              columns={LocationTableColumns()}
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

export default LocationList;
