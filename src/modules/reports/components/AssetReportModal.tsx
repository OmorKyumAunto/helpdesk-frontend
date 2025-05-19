import { Col, DatePicker, Input, Row, Select } from "antd";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import { rangePreset } from "../../../common/rangePreset";
import { useGetAssetReportQuery } from "../api/reportsEndPoints";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import dayjs from "dayjs";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
const { Option } = Select;

const AssetReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;
  const { data, isLoading, isFetching } = useGetAssetReportQuery({
    ...filter,
  });
  console.log(data?.query_data?.total_count);
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined />}
            onChange={(e) => setFilter({ ...filter, key: e.target.value })}
            placeholder="Search..."
            allowClear
          />
        </Col>
        <Col span={24}>
          <Select
            loading={unitIsLoading}
            style={{ width: "100%" }}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, unit: e })}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
        </Col>
        <Col span={24}>
          <DatePicker.RangePicker
            presets={rangePreset}
            style={{ width: "100%" }}
            onChange={(_, e) =>
              setFilter({
                ...filter,
                start_date: e[0],
                end_date: e[1],
              })
            }
          />
        </Col>
        <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
            onChange={(e) => setFilter({ ...filter, category: e })}
            placeholder="Select Category"
            allowClear
          >
            <Option value="laptop">Laptop</Option>
            <Option value="desktop">Desktop</Option>
            <Option value="accessories">Accessories</Option>
          </Select>
        </Col>
        <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
            onChange={(e) => setFilter({ ...filter, remarks: e })}
            placeholder="Select Status"
            allowClear
          >
            <Option value="assigned">Assigned</Option>
            <Option value="in_stock">In Stock</Option>
          </Select>
        </Col>
        <Col span={24}>
          <ExcelDownload
            isLoading={isLoading || isFetching}
            width="100%"
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
        </Col>
        <Col span={24}>
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
              "User Name",
              "Employee ID",
              "Department",
              "Designation",
            ]}
            PDFData={{
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
              "User Name": data?.query_data?.report_generate_employee_name,
              "Employee ID": data?.query_data?.report_generate_employee_id,
              Department: data?.query_data?.report_generate_department,
              Designation: data?.query_data?.report_generate_designation,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default AssetReportModal;
