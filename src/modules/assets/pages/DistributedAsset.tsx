import { Card, Input, Select, Space } from "antd";
import { Table } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DistributedAssetsTableColumns } from "../utils/DistributedTableColumns";
import {
  useGetAllDistributedAssetQuery,
  useGetOverAllDistributedAssetQuery,
} from "../api/assetsEndPoint";
import {
  generatePagination,
  tablePagination,
} from "../../../common/TablePagination copy";
import { SearchOutlined } from "@ant-design/icons";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import dayjs from "dayjs";
const { Option } = Select;
const DistributedAsset = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "2",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "2";
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<any>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter({
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);
  const { data, isLoading } = useGetAllDistributedAssetQuery({ ...filter });
  const { data: allDistributedAsset } = useGetOverAllDistributedAssetQuery();
  return (
    <div>
      <Card
        title={`Distributed Asset List `}
        style={{
          boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
          marginBottom: "1rem",
        }}
        extra={
          <Space>
            <Input
              prefix={<SearchOutlined />}
              onChange={(e) =>
                setFilter({ ...filter, key: e.target.value, offset: 0 })
              }
              placeholder="Search..."
            />
            <Select
              style={{ width: "180px" }}
              onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
              placeholder="Select Unit Name"
            >
              <Option value="">All</Option>
              <Option value="JTML">JTML</Option>
              <Option value="DIPL">DIPL</Option>
              <Option value="Corporate Office">Corporate Office</Option>
            </Select>
            <PDFDownload
              PDFFileName="distributed_asset_list"
              fileHeader="Distributed ASSET LIST"
              PDFHeader={[
                "No",
                "Employee ID",
                "Employee Name",
                "Department",
                "Unit",
                "Asset Type",
                "Serial No",
                "Assigning Date",
              ]}
              PDFData={
                allDistributedAsset?.data?.length
                  ? allDistributedAsset?.data?.map(
                      (
                        {
                          employee_id_no,
                          employee_name,
                          employee_department,
                          category,
                          assign_date,
                          serial_number,
                          employee_unit,
                        }: any,
                        index
                      ) => {
                        const data = {
                          No: index + 1,
                          "Employee ID": employee_id_no,
                          "Employee Name": employee_name,
                          Department: employee_department,
                          Unit: employee_unit,
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

            <ExcelDownload
              excelName={"distributed_asset_list"}
              excelTableHead={[
                "Employee ID",
                "Employee Name",
                "Department",
                "Unit",
                "Asset Type",
                "Serial No",
                "Assigning Date",
              ]}
              excelData={
                allDistributedAsset?.data?.length
                  ? allDistributedAsset?.data?.map(
                      ({
                        employee_id_no,
                        employee_name,
                        employee_department,
                        category,
                        assign_date,
                        serial_number,
                        employee_unit,
                      }: any) => {
                        const data = {
                          "Employee ID": employee_id_no,
                          "Employee Name": employee_name,
                          Department: employee_department,
                          Unit: employee_unit,
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
          </Space>
        }
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
            pagination={{
              ...generatePagination(
                Number(data?.total),
                setPagination,
                pagination
              ),
              current: Number(page),
              showSizeChanger: true,
              defaultPageSize: 2,
              pageSizeOptions: [
                "10",
                "20",
                "2",
                "100",
                "200",
                "300",
                "400",
                "20",
              ],
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
                  ((pagination.current || 1) - 1) * (pagination.pageSize || 2),
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
