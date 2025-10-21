import {
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Card,
  Space,
  Button,
  Statistic,
  Badge,
  Typography,
} from "antd";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetDisbursementsReportQuery } from "../api/reportsEndPoints";
import { rangePreset } from "../../../common/rangePreset";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const DisbursementReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });

  useEffect(() => { setFilter({}); }, []);

  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption = profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const { data, isLoading, isFetching } = useGetDisbursementsReportQuery({ ...filter });

  const clearAllFilters = () => setFilter({});

  const activeFilterCount = Object.keys(filter).filter(
    key => filter[key] !== undefined && filter[key] !== null && filter[key] !== ''
  ).length;

  const labelStyle = {
    fontWeight: 500,
    fontSize: 12,
    color: "#666",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4,
  };

  return (
    <div style={{ padding: 12, maxWidth: 1300, margin: "0 auto" }}>
      {/* --- Header Section --- */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 12,
          background: "linear-gradient(135deg, #17009bff 0%, #6c0fd6ff 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={12} sm={8}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Total Disbursements</span>}
              value={data?.query_data?.total_count || 0}
              valueStyle={{ color: 'white', fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={8}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Active Filters</span>}
              value={activeFilterCount}
              valueStyle={{ color: 'white', fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600 }}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Quick Actions</Text>
              <Space wrap>
                <ExcelDownload
                  isLoading={isLoading || isFetching}
                  excelName="Disbursement Report"
                  excelTableHead={[
                    "User Name","Employee ID","Designation","Department","Asset No","Name","Category","Purchase Date","Serial Number","PO Number","Unit Name","Model","Specification","Location Name","Price","Remarks","Assigned By","Assigner ID","Assigner Designation","Assigned Contact"
                  ]}
                  excelData={data?.data?.length
                    ? data.data.map(({
                        name, category, purchase_date, serial_number, po_number, price,
                        unit_name, model, specification, asset_no, remarks, location_name,
                        department, designation, user_id_no, user_name,
                        assign_by_name, assign_by_employee_id, assign_by_designation, assign_by_contact_no
                      }) => ({
                        "User Name": user_name,
                        "Employee ID": user_id_no,
                        Designation: designation,
                        Department: department,
                        "Asset No": asset_no||0,
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
                        "Assigned By": assign_by_name,
                        "Assigner ID": assign_by_employee_id,
                        "Assigner Designation": assign_by_designation,
                        "Assigned Contact": assign_by_contact_no
                      }))
                    : []}
                />
                <PDFDownload
                  PDFFileName="disbursement_report_query_data"
                  fileHeader="Disbursement Report Query Data"
                  PDFHeader={["Unit","Start Date","End Date","Category","Employee Type","Searching Keywords","Total Count"]}
                  PDFData={{
                    Unit: data?.query_data?.unit_name || "All",
                    "Start Date": data?.query_data?.start_date ? dayjs(data.query_data.start_date).format("DD-MM-YYYY") : "Not Applied",
                    "End Date": data?.query_data?.end_date ? dayjs(data.query_data.end_date).format("DD-MM-YYYY") : "Not Applied",
                    Category: data?.query_data?.category || "All",
                    "Employee Type": data?.query_data?.employee_type || "All",
                    "Searching Keywords": data?.query_data?.key || "None",
                    "Total Count": data?.query_data?.total_count || 0
                  }}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* --- Filters Section --- */}
      <Card
        title={
          <Space>
            <FilterOutlined />
            <span style={{ fontWeight: 600 }}>Filters</span>
            {activeFilterCount > 0 && <Badge count={activeFilterCount} color="#52c41a" />}
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            {activeFilterCount>0 && <Button type="link" icon={<ClearOutlined />} danger onClick={clearAllFilters}>Clear</Button>}
            <Button type="text" onClick={()=>setIsFilterExpanded(!isFilterExpanded)}>{isFilterExpanded ? "Collapse" : "Expand"}</Button>
          </Space>
        }
        style={{ marginBottom:16, borderRadius:12 }}
      >
        {isFilterExpanded && (
          <Row gutter={[12,12]}>
            {/* Search */}
            <Col xs={24}>
              <Text style={labelStyle} title="Search Disbursements">Search Disbursements</Text>
              <Input
                size="middle"
                prefix={<SearchOutlined style={{color:'#999'}} />}
                placeholder="Search by Emp ID, Name, Asset, Serial, PO or Model No..."
                allowClear
                value={filter.key}
                onChange={(e)=>setFilter({...filter,key:e.target.value})}
              />
            </Col>

            {/* Unit */}
            <Col xs={24} sm={12} lg={8}>
              <Text style={labelStyle} title="Unit Name">Unit Name</Text>
              <Select
                size="middle"
                loading={unitIsLoading}
                style={{ width:"100%" }}
                placeholder="Select Unit Name"
                showSearch
                allowClear
                value={filter.unit}
                onChange={(e)=>setFilter({...filter,unit:e})}
                options={unitOption?.map((unit:any)=>({value:unit.id,label:unit.title}))}
              />
            </Col>

            {/* Category */}
            <Col xs={24} sm={12} lg={8}>
              <Text style={labelStyle} title="Category">Category</Text>
              <Select
                size="middle"
                style={{ width:"100%" }}
                placeholder="Select Category"
                allowClear
                showSearch
                value={filter.category}
                onChange={(e)=>setFilter({...filter,category:e})}
              >
                {[
                  "Laptop","Desktop","Monitor","Printer","Accessories","TV","iPad/Tab","Projector","Attendance Machine","Speaker","Scanner","Camera","NVR/DVR","Online/Industrial UPS","Conference System","Firewall","Core Router","Access Point","Server","Network Rack","24 Port Switch Manageable","48 Port Switch Manageable","Non Manageable Switch"
                ].map(item=><Option key={item.toLowerCase()} value={item.toLowerCase()}>{item}</Option>)}
              </Select>
            </Col>

            {/* Employee Type */}
            <Col xs={24} sm={12} lg={8}>
              <Text style={labelStyle} title="Employee Type">Employee Type</Text>
              <Select
                size="middle"
                style={{ width:"100%" }}
                placeholder="Select Employee Type"
                allowClear
                value={filter.employee_type}
                onChange={(e)=>setFilter({...filter,employee_type:e})}
              >
                <Option value="">All</Option>
                <Option value="management">Management</Option>
                <Option value="non-management">Non Management</Option>
              </Select>
            </Col>

            {/* Disbursement Date Range */}
            <Col xs={24} sm={12} lg={12}>
              <Text style={labelStyle} title="Disbursement Date Range">Disbursement Date Range</Text>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width:"100%" }}
                placeholder={["Start Date","End Date"]}
                onChange={(_,e)=>setFilter({...filter,start_date:e[0],end_date:e[1]})}
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* --- Active Filter Summary --- */}
      {activeFilterCount>0 && (
        <Card size="small" bordered={false} style={{ marginBottom:16, background:"#fff1f0", borderLeft:"3px solid #f5576c", borderRadius:10 }}>
          <Space wrap size="small" style={{fontSize:12}}>
            <Text strong style={{color:"#f5576c"}}>Active Filters:</Text>
            {filter.key && <Badge status="processing" text={`Search: "${filter.key}"`} />}
            {filter.unit && <Badge status="processing" text="Unit Selected" />}
            {filter.start_date && <Badge status="processing" text="Date Range Applied" />}
            {filter.category && <Badge status="processing" text={`Category: ${filter.category}`} />}
            {filter.employee_type && <Badge status="processing" text={`Employee Type: ${filter.employee_type}`} />}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default DisbursementReportModal;
