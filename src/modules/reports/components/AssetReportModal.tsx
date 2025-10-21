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
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetAssetReportQuery } from "../api/reportsEndPoints";
import { rangePreset } from "../../../common/rangePreset";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Option } = Select;
const { Text } = Typography;

const AssetReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });

  useEffect(() => setFilter({}), []);

  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption = profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const { data, isLoading, isFetching } = useGetAssetReportQuery({ ...filter });

  const clearAllFilters = () => setFilter({});
  const activeFilterCount = Object.keys(filter).filter(
    (key) => filter[key] !== undefined && filter[key] !== null && filter[key] !== ""
  ).length;

  const labelStyle = {
    fontWeight: 500,
    fontSize: 12,
    color: "#666",
    display: "block",
    marginBottom: 4,
  };

  return (
    <div style={{ padding: 12, maxWidth: 1300, margin: "0 auto" }}>
      {/* Header / Statistics */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 12,
          background: "linear-gradient(135deg, #03176fff 0%, #7a07ecff 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={12} sm={8}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Total Assets</span>}
              value={data?.query_data?.total_count || 0}
              valueStyle={{ color: "white", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={8}>
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Active Filters</span>}
              prefix={<FilterOutlined />}
              value={activeFilterCount}
              valueStyle={{ color: "white", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Quick Actions</Text>
              <Space wrap>
                <ExcelDownload
                  isLoading={isLoading || isFetching}
                  excelName={"Asset Report"}
                  excelTableHead={[
                    "Asset No","Name","Category","Purchase Date","Serial Number","PO Number","Unit Name",
                    "Model","Specification","Location Name","Price","Remarks","Created By","Creator ID",
                    "Creator Designation","Creator Contact No"
                  ]}
                  excelData={data?.data?.length
                    ? data?.data.map(({
                        name, category, purchase_date, serial_number, po_number, price,
                        unit_name, model, specification, asset_no, remarks, location_name,
                        asset_created_name, asset_created_employee_id, asset_created_designation, asset_created_contact_no
                      }) => ({
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
                        "Created By": asset_created_name,
                        "Creator ID": asset_created_employee_id,
                        "Creator Designation": asset_created_designation,
                        "Creator Contact No": asset_created_contact_no
                      }))
                    : []}
                />
                <PDFDownload
                  PDFFileName="asset_report_query_data"
                  fileHeader="Asset Report Count Data"
                  PDFHeader={["Unit Name","Start Creation Date","End Creation Date","Start Purchase Date","End Purchase Date","Category","Remarks","Total Count"]}
                  PDFData={{
                    "Unit Name": data?.query_data?.unit_name||"All",
                    "Start Creation Date": data?.query_data?.start_date ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY"):"Not Applied",
                    "End Creation Date": data?.query_data?.end_date ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY"):"Not Applied",
                    "Start Purchase Date": data?.query_data?.start_purchase_date ? dayjs(data?.query_data?.start_purchase_date).format("DD-MM-YYYY"):"Not Applied",
                    "End Purchase Date": data?.query_data?.end_purchase_date ? dayjs(data?.query_data?.end_purchase_date).format("DD-MM-YYYY"):"Not Applied",
                    Category: data?.query_data?.category||"All",
                    Remarks: data?.query_data?.remarks||"All",
                    "Total Count": data?.query_data?.total_count||0
                  }}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card
        bordered={false}
        title={
          <Space>
            <FilterOutlined />
            <span style={{ fontWeight: 600 }}>Filters</span>
            {activeFilterCount>0 && <Badge count={activeFilterCount} color="#52c41a"/>}
          </Space>
        }
        extra={
          <Space>
            {activeFilterCount>0 && <Button type="link" icon={<ClearOutlined/>} onClick={clearAllFilters} danger>Clear</Button>}
            <Button type="text" onClick={()=>setIsFilterExpanded(!isFilterExpanded)}>
              {isFilterExpanded ? "Collapse" : "Expand"}
            </Button>
          </Space>
        }
        style={{ marginBottom: 16, borderRadius: 12 }}
      >
        {isFilterExpanded && (
          <Row gutter={[12, 12]}>
            {/* Search */}
            <Col xs={24} sm={24}>
              <Text style={labelStyle} title="Search Assets">Search Assets</Text>
              <Input
                size="middle"
                prefix={<SearchOutlined style={{color:'#999'}} />}
                placeholder="Search by Asset, Serial, PO or Model No..."
                allowClear
                value={filter.key}
                onChange={(e)=>setFilter({...filter,key:e.target.value})}
              />
            </Col>

            {/* 2-per-row Filters */}
            <Col xs={24} sm={12}>
              <Text style={labelStyle} title="Unit Name">Unit Name</Text>
              <Select
                size="middle"
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit Name"
                showSearch
                allowClear
                value={filter.unit}
                onChange={(e)=>setFilter({...filter,unit:e})}
                options={unitOption?.map((unit:any)=>({value:unit.id,label:unit.title}))}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Text style={labelStyle} title="Category">Category</Text>
              <Select
                size="middle"
                style={{ width: "100%" }}
                placeholder="Select Category"
                allowClear
                showSearch
                value={filter.category}
                onChange={(e)=>setFilter({...filter,category:e})}
              >
                {[
                  "Laptop","Desktop","Monitor","Printer","Accessories","TV","iPad/Tab","Projector","Attendance Machine",
                  "Speaker","Scanner","Camera","NVR/DVR","Online/Industrial UPS","Conference System","Firewall","Core Router",
                  "Access Point","Server","Network Rack","24 Port Switch Manageable","48 Port Switch Manageable","Non Manageable Switch"
                ].map(item=><Option key={item.toLowerCase()} value={item.toLowerCase()}>{item}</Option>)}
              </Select>
            </Col>

            <Col xs={24} sm={12}>
              <Text style={labelStyle} title="Status">Status</Text>
              <Select
                size="middle"
                style={{ width: "100%" }}
                placeholder="Select Status"
                allowClear
                value={filter.remarks}
                onChange={(e)=>setFilter({...filter,remarks:e})}
              >
                <Option value="assigned">Assigned</Option>
                <Option value="in_stock">In Stock</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12}>
              <Text style={labelStyle} title="Creation Date Range">Creation Date Range</Text>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width:"100%" }}
                placeholder={["Start Date","End Date"]}
                onChange={(_,e)=>setFilter({...filter,start_date:e[0],end_date:e[1]})}
              />
            </Col>

            <Col xs={24} sm={12}>
              <Text style={labelStyle} title="Purchase Date Range">Purchase Date Range</Text>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width:"100%" }}
                placeholder={["Start Date","End Date"]}
                onChange={(_,e)=>setFilter({...filter,start_purchase_date:e[0],end_purchase_date:e[1]})}
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* Active Filter Summary */}
      {activeFilterCount>0 && (
        <Card size="small" bordered={false} style={{ marginBottom:16, background:"#f0f5ff", borderLeft:"3px solid #1890ff", borderRadius:10 }}>
          <Space wrap size="small" style={{fontSize:12}}>
            <Text strong style={{color:"#1890ff"}}>Active Filters:</Text>
            {filter.key && <Badge status="processing" text={`Search: "${filter.key}"`} />}
            {filter.unit && <Badge status="processing" text="Unit Selected" />}
            {filter.start_date && <Badge status="processing" text="Creation Date Range" />}
            {filter.start_purchase_date && <Badge status="processing" text="Purchase Date Range" />}
            {filter.category && <Badge status="processing" text={`Category: ${filter.category}`} />}
            {filter.remarks && <Badge status="processing" text={`Status: ${filter.remarks}`} />}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default AssetReportModal;
