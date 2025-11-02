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
  Tag,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  AppstoreOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetDisbursementsReportQuery } from "../api/reportsEndPoints";
import { rangePreset } from "../../../common/rangePreset";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const { Option } = Select;
const { Text } = Typography;

const DisbursementReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  useEffect(() => setFilter({}), []);

  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const { data, isLoading, isFetching } = useGetDisbursementsReportQuery({
    ...filter,
  });

  const clearAllFilters = () => setFilter({});

  const activeFilterCount = Object.keys(filter).filter(
    (key) =>
      filter[key] !== undefined && filter[key] !== null && filter[key] !== ""
  ).length;

  const categoryData = data?.category_data?.[0] || {};

  return (
    <div
      style={{
        padding: "clamp(8px, 2vw, 16px)",
        background: "#f5f5f5",
      }}
    >
      {/* Header with Key Metrics */}
      <Card
        bordered={false}
        size="small"
        style={{
          marginBottom: 12,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
      >
        <Row gutter={[8, 12]} align="middle">
          <Col xs={24} sm={24} md={18} lg={18}>
            <Row gutter={[8, 12]}>
              <Col xs={8} sm={8} md={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Total Disbursements
                    </span>
                  }
                  value={data?.query_data?.total_count || 0}
                  valueStyle={{
                    fontSize: "clamp(16px, 3vw, 22px)",
                    fontWeight: 600,
                    color: "#1890ff",
                  }}
                  prefix={
                    <AppstoreOutlined
                      style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
                    />
                  }
                />
              </Col>
              <Col xs={8} sm={8} md={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Active Categories
                    </span>
                  }
                  value={
                    Object.values(categoryData).filter(
                      (count) => Number(count) > 0
                    ).length
                  }
                  valueStyle={{
                    fontSize: "clamp(16px, 3vw, 22px)",
                    fontWeight: 600,
                    color: "#52c41a",
                  }}
                  prefix={
                    <TeamOutlined
                      style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
                    />
                  }
                />
              </Col>
              <Col xs={8} sm={8} md={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Active Filters
                    </span>
                  }
                  value={activeFilterCount}
                  valueStyle={{
                    fontSize: "clamp(16px, 3vw, 22px)",
                    fontWeight: 600,
                    color: "#722ed1",
                  }}
                  prefix={
                    <FilterOutlined
                      style={{ fontSize: "clamp(14px, 2.5vw, 18px)" }}
                    />
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={6}
            lg={6}
            style={{
              textAlign: window.innerWidth > 768 ? "right" : "center",
            }}
          >
            <Space
              wrap
              size={[8, 8]}
              style={{
                justifyContent:
                  window.innerWidth > 768 ? "flex-end" : "center",
              }}
            >
              <ExcelDownload
                isLoading={isLoading || isFetching}
                excelName="Disbursement Report"
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
                  "Device Remarks",
                  "Assigned By",
                  "Assigner ID",
                  "Assigner Designation",
                  "Assigned Contact",
                ]}
                excelData={
                  data?.data?.length
                    ? data.data.map(
                        ({
                          asset_name,
                          category,
                          purchase_date,
                          serial_number,
                          po_number,
                          asset_unit_name,
                          model,
                          specification,
                          asset_no,
                          device_remarks,
                          location_name,
                          department,
                          designation,
                          user_id_no,
                          user_name,
                          assign_by_name,
                          assign_by_employee_id,
                          assign_by_designation,
                          assign_by_contact_no,
                        }: any) => ({
                          "User Name": user_name,
                          "Employee ID": user_id_no,
                          Designation: designation,
                          Department: department,
                          "Asset No": asset_no || 0,
                          Name: asset_name,
                          Category: category,
                          "Purchase Date": dayjs(purchase_date).format(
                            "DD-MM-YYYY"
                          ),
                          "Serial Number": serial_number,
                          "PO Number": po_number,
                          "Unit Name": asset_unit_name,
                          Model: model,
                          Specification: specification,
                          "Location Name": location_name,
                          "Device Remarks": device_remarks,
                          "Assigned By": assign_by_name,
                          "Assigner ID": assign_by_employee_id,
                          "Assigner Designation": assign_by_designation,
                          "Assigned Contact": assign_by_contact_no,
                        })
                      )
                    : []
                }
              />
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
                    ? dayjs(data.query_data.start_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "End Date": data?.query_data?.end_date
                    ? dayjs(data.query_data.end_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  Category: data?.query_data?.category || "All",
                  "Employee Type": data?.query_data?.employee_type || "All",
                  "Searching Keywords": data?.query_data?.key || "None",
                  "Total Count": data?.query_data?.total_count || 0,
                }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Category Breakdown Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        {[
          {
            title: "Laptops",
            count: categoryData.total_laptop,
            color: "#1890ff",
            icon: "💻",
          },
          {
            title: "Desktops",
            count: categoryData.total_desktop,
            color: "#52c41a",
            icon: "🖥️",
          },
          {
            title: "Monitors",
            count: categoryData.total_monitor,
            color: "#722ed1",
            icon: "🖥",
          },
          {
            title: "TVs",
            count: categoryData.tv_count,
            color: "#fa8c16",
            icon: "📺",
          },
        ]
          .filter((item) => item.count > 0 || activeFilterCount === 0)
          .map((item, idx) => (
            <Col xs={12} sm={6} key={idx}>
              <Card
                size="small"
                bordered={false}
                style={{
                  borderRadius: 6,
                  borderLeft: `3px solid ${item.color}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
                bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
              >
                <Space direction="vertical" size={2} style={{ width: "100%" }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                  >
                    {item.icon} {item.title}
                  </Text>
                  <Text
                    strong
                    style={{
                      fontSize: "clamp(16px, 3vw, 20px)",
                      color: item.color,
                    }}
                  >
                    {item.count || 0}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Asset Categories - Tabbed Design */}
      {categoryData && (
        <Card
          size="small"
          bordered={false}
          title={
            <Space size="small">
              <BarChartOutlined style={{ fontSize: 14 }} />
              <span
                style={{
                  fontSize: "clamp(12px, 2vw, 14px)",
                  fontWeight: 600,
                }}
              >
                Disbursed Asset Categories
              </span>
            </Space>
          }
          style={{
            marginBottom: 12,
            borderRadius: 6,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
        >
          <Tabs
            defaultActiveKey="computing"
            size="small"
            items={[
              {
                key: "computing",
                label: (
                  <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}>
                    💻 Computing
                  </span>
                ),
                children: (
                  <Row gutter={[12, 12]}>
                    {[
                      { title: "Laptops", value: categoryData.total_laptop },
                      { title: "Desktops", value: categoryData.total_desktop },
                      { title: "Monitors", value: categoryData.total_monitor },
                      { title: "Tablets", value: categoryData.tab_count },
                      { title: "Servers", value: categoryData.server_count },
                    ]
                      .filter(
                        (item) => item.value > 0 || activeFilterCount === 0
                      )
                      .map((item, idx) => (
                        <Col xs={12} sm={8} md={6} lg={6} xl={4} key={idx}>
                          <div
                            style={{
                              background: "#fafafa",
                              border: "1px solid #e8e8e8",
                              borderRadius: 4,
                              padding: "clamp(8px, 2vw, 10px)",
                              textAlign: "center",
                              minHeight: 60,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "clamp(9px, 1.5vw, 11px)",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "clamp(12px, 2vw, 14px)",
                                color: "#262626",
                              }}
                            >
                              {item.value || 0}
                            </Text>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ),
              },
              {
                key: "network",
                label: (
                  <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}>
                    🌐 Network
                  </span>
                ),
                children: (
                  <Row gutter={[12, 12]}>
                    {[
                      { title: "Firewalls", value: categoryData.firewall_count },
                      {
                        title: "Core Routers",
                        value: categoryData.core_router_count,
                      },
                      {
                        title: "Access Points",
                        value: categoryData.access_point_count,
                      },
                      {
                        title: "Network Racks",
                        value: categoryData.network_rack_count,
                      },
                      {
                        title: "24 Port Switches",
                        value: categoryData.port_24_switch_count,
                      },
                      {
                        title: "48 Port Switches",
                        value: categoryData.port_48_switch_count,
                      },
                      {
                        title: "Non-Manageable Switches",
                        value: categoryData.non_managable_switch_count,
                      },
                    ]
                      .filter(
                        (item) => item.value > 0 || activeFilterCount === 0
                      )
                      .map((item, idx) => (
                        <Col xs={12} sm={8} md={6} lg={6} xl={4} key={idx}>
                          <div
                            style={{
                              background: "#fafafa",
                              border: "1px solid #e8e8e8",
                              borderRadius: 4,
                              padding: "clamp(8px, 2vw, 10px)",
                              textAlign: "center",
                              minHeight: 60,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "clamp(9px, 1.5vw, 11px)",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "clamp(12px, 2vw, 14px)",
                                color: "#262626",
                              }}
                            >
                              {item.value || 0}
                            </Text>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ),
              },
              {
                key: "peripherals",
                label: (
                  <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}>
                    🖨️ Peripherals
                  </span>
                ),
                children: (
                  <Row gutter={[12, 12]}>
                    {[
                      { title: "Printers", value: categoryData.printer_count },
                      { title: "Scanners", value: categoryData.scanner_count },
                      {
                        title: "Accessories",
                        value: categoryData.accessories_count,
                      },
                      { title: "Projectors", value: categoryData.projector_count },
                      { title: "Speakers", value: categoryData.speaker_count },
                      { title: "TVs", value: categoryData.tv_count },
                    ]
                      .filter(
                        (item) => item.value > 0 || activeFilterCount === 0
                      )
                      .map((item, idx) => (
                        <Col xs={12} sm={8} md={6} lg={6} xl={4} key={idx}>
                          <div
                            style={{
                              background: "#fafafa",
                              border: "1px solid #e8e8e8",
                              borderRadius: 4,
                              padding: "clamp(8px, 2vw, 10px)",
                              textAlign: "center",
                              minHeight: 60,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "clamp(9px, 1.5vw, 11px)",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "clamp(12px, 2vw, 14px)",
                                color: "#262626",
                              }}
                            >
                              {item.value || 0}
                            </Text>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ),
              },
              {
                key: "security",
                label: (
                  <span style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}>
                    🔒 Security & Power
                  </span>
                ),
                children: (
                  <Row gutter={[12, 12]}>
                    {[
                      { title: "Cameras", value: categoryData.camera_count },
                      { title: "NVR/DVR", value: categoryData.nvr_dvr_count },
                      {
                        title: "Attendance Machines",
                        value: categoryData.attendance_machine_count,
                      },
                      { title: "UPS", value: categoryData.ups_count },
                      {
                        title: "Conference Systems",
                        value: categoryData.conference_system_count,
                      },
                    ]
                      .filter(
                        (item) => item.value > 0 || activeFilterCount === 0
                      )
                      .map((item, idx) => (
                        <Col xs={12} sm={8} md={6} lg={6} xl={4} key={idx}>
                          <div
                            style={{
                              background: "#fafafa",
                              border: "1px solid #e8e8e8",
                              borderRadius: 4,
                              padding: "clamp(8px, 2vw, 10px)",
                              textAlign: "center",
                              minHeight: 60,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              type="secondary"
                              style={{
                                fontSize: "clamp(9px, 1.5vw, 11px)",
                                display: "block",
                                marginBottom: 4,
                              }}
                            >
                              {item.title}
                            </Text>
                            <Text
                              strong
                              style={{
                                fontSize: "clamp(12px, 2vw, 14px)",
                                color: "#262626",
                              }}
                            >
                              {item.value || 0}
                            </Text>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ),
              },
            ]}
          />
        </Card>
      )}

      {/* Filters */}
      <Card
        size="small"
        title={
          <Space size="small">
            <FilterOutlined style={{ fontSize: 14 }} />
            <span
              style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 600 }}
            >
              Filters
            </span>
            {activeFilterCount > 0 && (
              <Badge
                count={activeFilterCount}
                style={{ backgroundColor: "#1890ff" }}
              />
            )}
          </Space>
        }
        bordered={false}
        extra={
          <Space size={4}>
            {activeFilterCount > 0 && (
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                danger
                style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}
              >
                <span
                  style={{
                    display: window.innerWidth > 480 ? "inline" : "none",
                  }}
                >
                  Clear
                </span>
              </Button>
            )}
            <Button
              type="text"
              size="small"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}
            >
              {isFilterExpanded ? "Hide" : "Show"}
            </Button>
          </Space>
        }
        style={{
          marginBottom: 12,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: isFilterExpanded ? "clamp(12px, 2vw, 16px)" : 0,
          display: isFilterExpanded ? "block" : "none",
        }}
      >
        <Row gutter={[12, 12]}>
          {/* Search */}
          <Col xs={24} sm={24} md={12}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Search Disbursements
              </Text>
              <Input
                size="middle"
                prefix={<SearchOutlined style={{ color: "#999" }} />}
                placeholder="Search by Emp ID, Name, Asset, Serial, PO or Model..."
                allowClear
                value={filter.key}
                onChange={(e) => setFilter({ ...filter, key: e.target.value })}
              />
            </Space>
          </Col>

          {/* Unit Name */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Unit Name
              </Text>
              <Select
                size="middle"
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit"
                showSearch
                allowClear
                optionFilterProp="children"
                value={filter.unit}
                onChange={(e) => setFilter({ ...filter, unit: e })}
                options={unitOption?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
              />
            </Space>
          </Col>

          {/* Category */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Category
              </Text>
              <Select
                size="middle"
                style={{ width: "100%" }}
                placeholder="Select Category"
                allowClear
                showSearch
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e })}
              >
                {[
                  "Laptop",
                  "Desktop",
                  "Monitor",
                  "Printer",
                  "Accessories",
                  "TV",
                  "iPad/Tab",
                  "Projector",
                  "Attendance Machine",
                  "Speaker",
                  "Scanner",
                  "Camera",
                  "NVR/DVR",
                  "Online/Industrial UPS",
                  "Conference System",
                  "Firewall",
                  "Core Router",
                  "Access Point",
                  "Server",
                  "Network Rack",
                  "24 Port Switch Manageable",
                  "48 Port Switch Manageable",
                  "Non Manageable Switch",
                ].map((item) => (
                  <Option key={item.toLowerCase()} value={item.toLowerCase()}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>

          {/* Employee Type */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Employee Type
              </Text>
              <Select
                size="middle"
                style={{ width: "100%" }}
                placeholder="Select Type"
                allowClear
                value={filter.employee_type}
                onChange={(e) => setFilter({ ...filter, employee_type: e })}
              >
                <Option value="management">Management</Option>
                <Option value="non-management">Non Management</Option>
              </Select>
            </Space>
          </Col>

          {/* Disbursement Date Range */}
          <Col xs={24} sm={24} md={12}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Disbursement Date Range
              </Text>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width: "100%" }}
                placeholder={["Start Date", "End Date"]}
                onChange={(_, e) =>
                  setFilter({
                    ...filter,
                    start_date: e[0],
                    end_date: e[1],
                  })
                }
                value={
                  filter.start_date && filter.end_date
                    ? [dayjs(filter.start_date), dayjs(filter.end_date)]
                    : undefined
                }
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Card
          size="small"
          bordered={false}
          style={{
            marginBottom: 12,
            background: "#e6f7ff",
            borderLeft: "3px solid #1890ff",
            borderRadius: 6,
          }}
          bodyStyle={{ padding: "clamp(8px, 2vw, 10px)" }}
        >
          <Space wrap size={[8, 4]}>
            <Text
              strong
              style={{
                fontSize: "clamp(11px, 1.5vw, 12px)",
                color: "#0050b3",
              }}
            >
              Active:
            </Text>
            {filter.key && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Search: "{filter.key}"
              </Tag>
            )}
            {filter.unit && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Unit
              </Tag>
            )}
            {filter.category && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Category: {filter.category}
              </Tag>
            )}
            {filter.employee_type && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Type: {filter.employee_type}
              </Tag>
            )}
            {filter.start_date && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Date Range
              </Tag>
            )}
          </Space>
        </Card>
      )}

      {/* Report Info Footer */}
      {data?.query_data && (
        <Card
          size="small"
          bordered={false}
          style={{
            borderRadius: 6,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
        >
          <Row gutter={[12, 8]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Report For
                </Text>
                <Text strong style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>
                  {data.query_data.unit_name || "All Units"}
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Generated By
                </Text>
                <Text strong style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>
                  {data.query_data.report_generate_employee_name
                    ? `${data.query_data.report_generate_employee_name} (${
                        data.query_data.report_generate_employee_id || ""
                      })`
                    : "N/A"}
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Department
                </Text>
                <Text strong style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>
                  {data.query_data.report_generate_department || "N/A"}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default DisbursementReportModal;