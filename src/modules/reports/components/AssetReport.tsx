import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Dropdown, Input, Select, Space } from "antd";
import { Table } from "antd/lib";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";

import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetAssetReportQuery } from "../api/reportsEndPoints";
import { AssetReportTableColumn } from "../utils/AssetReportTableColumn";
import dayjs from "dayjs";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
const { Option } = Select;

const AssetReport = () => {
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
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
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

  useEffect(() => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      limit: Number(pageSize),
      offset: skipValue,
      key: prevFilter?.key,
    }));
  }, [page, pageSize, skipValue]);
  const { data, isLoading, isFetching } = useGetAssetReportQuery({
    ...filter,
  });
  return (
    <div>
      <Card
        title="Asset Report"
        style={{
          boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: "12px",
          }}
        >
          <div style={{ width: "160px" }}>
            <Input
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setFilter({ ...filter, key: e.target.value, offset: 0 })
              }
              placeholder="Search..."
              allowClear
            />
          </div>
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
          <Dropdown
            trigger={["hover"]}
            dropdownRender={() => (
              <div
                style={{
                  padding: 16,
                  background: "#fff",
                  borderRadius: 8,
                  width: "160px",
                  border: "1px solid #f2f2f2",
                }}
              >
                <Select
                  style={{ width: "100%", marginBottom: 8 }}
                  onChange={(e) =>
                    setFilter({ ...filter, category: e, offset: 0 })
                  }
                  placeholder="Select Category"
                  allowClear
                >
                  <Option value="laptop">Laptop</Option>
                  <Option value="desktop">Desktop</Option>
                  <Option value="accessories">Accessories</Option>
                </Select>
                <Select
                  style={{ width: "100%", marginBottom: 8 }}
                  onChange={(e) =>
                    setFilter({ ...filter, remarks: e, offset: 0 })
                  }
                  placeholder="Select Status"
                  allowClear
                >
                  <Option value="assigned">Assigned</Option>
                  <Option value="in_stock">In Stock</Option>
                </Select>
              </div>
            )}
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Dropdown>
          <Space>
            <ExcelDownload
              excelName={"Asset Report"}
              excelTableHead={[
                "Asset No",
                "Name",
                "Category",
                "Purchase Date",
                "Serial Number",
                "PO Number",
                "Unit Name",
                "Model",
                "Specification",
                "Location Name",
                "Price",
                "Remarks",
              ]}
              excelData={
                data?.data?.length
                  ? data?.data?.map(
                      ({
                        name,
                        category,
                        purchase_date,
                        serial_number,
                        po_number,
                        price,
                        unit_name,
                        model,
                        specification,
                        asset_no,
                        remarks,
                        location_name,
                      }) => {
                        return {
                          "Asset No": asset_no || 0,
                          Name: name,
                          Category: category,
                          "Purchase Date":
                            dayjs(purchase_date).format("DD-MM-YYYY"),
                          "Serial Number": serial_number,
                          "PO Number": po_number,
                          "Unit Name": unit_name,
                          Model: model,
                          Specification: specification,
                          "Location Name": location_name,
                          Price: price,
                          Remarks: remarks,
                        };
                      }
                    )
                  : []
              }
            />

            <PDFDownload
              PDFFileName="asset_report_query_data"
              fileHeader="Asset Report Query Data"
              PDFHeader={[
                "Unit Name",
                "Start Date",
                "End Date",
                "Category",
                "Remarks",
                "Total Count",
              ]}
              PDFData={[
                {
                  "Unit Name": data?.query_data?.unit_name || "All",
                  "Start Date": data?.query_data?.start_date
                    ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                    : "ALL",
                  "End Date": data?.query_data?.end_date
                    ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                    : "ALL",
                  Category: data?.query_data?.category || "ALL",
                  Remarks: data?.query_data?.remarks || "ALL",
                  "Total Count": data?.query_data?.total_count || 0,
                },
              ]}
            />
          </Space>
        </div>
        <div>
          <Table
            rowKey="id"
            size="small"
            bordered
            loading={isLoading || isFetching}
            dataSource={data?.data?.length ? data.data : []}
            columns={AssetReportTableColumn()}
            scroll={{ x: true }}
            pagination={{
              ...generatePagination(
                Number(data?.count),
                setPagination,
                pagination
              ),
              current: Number(page),
              showSizeChanger: true,
              defaultPageSize: 50,
              pageSizeOptions: ["50", "100", "200", "300", "500", "1000"],
              total: data ? Number(data?.count) : 0,
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

export default AssetReport;
