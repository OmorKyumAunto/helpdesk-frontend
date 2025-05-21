import { Col, DatePicker, Input, Row, Select } from "antd";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import { rangePreset } from "../../../common/rangePreset";
import { useGetDisbursementsReportQuery } from "../api/reportsEndPoints";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import dayjs from "dayjs";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";

const { Option } = Select;

const DisbursementReportModal = () => {
  const [filter, setFilter] = useState<any>({});

  // Reset filters on open
  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const { data, isLoading, isFetching } = useGetDisbursementsReportQuery({
    ...filter,
  });

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined />}
            onChange={(e) => setFilter({ ...filter, key: e.target.value })}
            placeholder="Search By Emp ID/Name/Asset/Serial/PO or Model No..."
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
            <Option value="monitor">Monitor</Option>
            <Option value="printer">Printer</Option>
            <Option value="accessories">Accessories</Option>
            <Option value="tv">TV</Option>
            <Option value="ipad/tab">Ipad/Tab</Option>
            <Option value="projector">Projector</Option>
            <Option value="attendence machine">Attendence Machine</Option>
            <Option value="speaker">Speaker</Option>
            <Option value="scanner">Scanner</Option>
            <Option value="camera">Camera</Option>
            <Option value="nvr/dvr">NVR/DVR</Option>
            <Option value="online/industrial ups">Online/Industrial UPS</Option>
            <Option value="conference system">Conference System</Option>
            <Option value="firewall">Firewall</Option>
            <Option value="core router">Core Router</Option>
            <Option value="access point">Access Point</Option>
            <Option value="server">Server</Option>
            <Option value="network rack">Network Rack</Option>
            <Option value="24 port switch managable">24 Port Switch Managable</Option>
            <Option value="48 port switch managable">48 Port Switch Managable</Option>
            <Option value="non managable switch">Non Managable Switch</Option>
          </Select>
        </Col>

        <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
            onChange={(e) => setFilter({ ...filter, employee_type: e })}
            placeholder="Select Employee Type"
            allowClear
          >
            <Option value="">All</Option>
            <Option value="management">Management</Option>
            <Option value="non-management">Non Management</Option>
          </Select>
        </Col>

        <Col span={24}>
          <ExcelDownload
            isLoading={isLoading || isFetching}
            width="100%"
            excelName={"Disbursement Report"}
            excelTableHead={[
              "User Name",
              "Employee ID",
              "Designation",
              "Department",
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
                      department,
                      designation,
                      user_id_no,
                      user_name,
                    }) => ({
                      "User Name": user_name,
                      "Employee ID": user_id_no,
                      Designation: designation,
                      Department: department,
                      "Asset No": asset_no || 0,
                      Name: name,
                      Category: category,
                      "Purchase Date": dayjs(purchase_date).format("DD-MM-YYYY"),
                      "Serial Number": serial_number,
                      "PO Number": po_number,
                      "Unit Name": unit_name,
                      Model: model,
                      Specification: specification,
                      "Location Name": location_name,
                      Price: price,
                      Remarks: remarks,
                    })
                  )
                : []
            }
          />
        </Col>

        <Col span={24}>
          <PDFDownload
            PDFFileName="disbursement_report_query_data"
            fileHeader="Disbursement Report Query Data"
            PDFHeader={[
              "Unit",
              "Start Date",
              "End Date",
              "Category",
              "Employee Type",
              "Searching Keywords",
              "Total Count",
            ]}
            PDFData={{
              Unit: data?.query_data?.unit_name || "All",
              "Start Date": data?.query_data?.start_date
                ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                : "Not Applied",
              "End Date": data?.query_data?.end_date
                ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                : "Not Applied",
              Category: data?.query_data?.category || "All",
              "Employee Type": data?.query_data?.employee_type || "All",
              "Searching Keywords": data?.query_data?.key || "None",
              "Total Count": data?.query_data?.total_count || 0,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DisbursementReportModal;
