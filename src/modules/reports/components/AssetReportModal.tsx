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
  Collapse,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import Lottie from "lottie-react";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetAssetReportQuery } from "../api/reportsEndPoints";
import { rangePreset } from "../../../common/rangePreset";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import blueLoader from "../../../assets/blueloader.json";

const { Option } = Select;
const { Text } = Typography;

const AssetReportModal = () => {
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

  const { data, isLoading, isFetching } = useGetAssetReportQuery({ ...filter });

  const clearAllFilters = () => setFilter({});
  const activeFilterCount = Object.keys(filter).filter(
    (key) =>
      filter[key] !== undefined && filter[key] !== null && filter[key] !== ""
  ).length;

  const categoryData = (data?.category_data?.[0] || {}) as Record<string, any>;
  const totalPrice = data?.data?.reduce(
    (sum: number, item: any) => sum + (item.price || 0),
    0
  );

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "#f5f5f5",
        }}
      >
        <Lottie
          animationData={blueLoader}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

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
          <Col xs={24} sm={24} md={18} lg={16}>
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
                      Total Assets
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
              <Col xs={8} sm={8} md={11}>
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
                      Total Value
                    </span>
                  }
                  value={totalPrice || 0}
                  valueStyle={{
                    fontSize: "clamp(13px, 2.2vw, 18px)",
                    fontWeight: 600,
                    color: "#52c41a",
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                  }}
                  prefix={
                    <DollarOutlined
                      style={{ fontSize: "clamp(11px, 1.8vw, 14px)", marginRight: 4 }}
                    />
                  }
                  suffix={
                    <span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", marginLeft: 4 }}>
                      BDT
                    </span>
                  }
                  formatter={(value) => {
                    const num = Number(value);
                    if (num >= 10000000) {
                      // Crores (1 Cr = 10,000,000)
                      return `${(num / 10000000).toFixed(1)} Crore`;
                    } else if (num >= 100000) {
                      // Lakhs (1 L = 100,000)
                      return `${(num / 100000).toFixed(1)} Lakhs`;
                    } else if (num >= 1000) {
                      // Thousands
                      return `${(num / 1000).toFixed(1)} K`;
                    }
                    return num.toLocaleString('en-IN');
                  }}
                />
              </Col>
              <Col xs={8} sm={8} md={5}>
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
                      Categories
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
                    color: "#722ed1",
                  }}
                  prefix={
                    <ShoppingOutlined
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
            lg={8}
            style={{
              textAlign: window.innerWidth > 768 ? "right" : "center",
            }}
          >
            <Space wrap size={[8, 8]} style={{ justifyContent: window.innerWidth > 768 ? "flex-end" : "center" }}>
              <ExcelDownload
                isLoading={isLoading || isFetching}
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
                  "Created By",
                  "Creator ID",
                  "Creator Designation",
                  "Creator Contact No",
                ]}
                excelData={
                  data?.data?.length
                    ? data?.data.map(
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
                        asset_created_name,
                        asset_created_employee_id,
                        asset_created_designation,
                        asset_created_contact_no,
                      }: any) => ({
                        "Asset No": asset_no || 0,
                        Name: name,
                        Category: category,
                        "Purchase Date": dayjs(purchase_date).format(
                          "DD-MM-YYYY"
                        ),
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
                        "Creator Contact No": asset_created_contact_no,
                      })
                    )
                    : []
                }
              />
              <PDFDownload
                PDFFileName="asset_report_query_data"
                fileHeader="Asset Report Count Data"
                PDFHeader={[
                  "Unit Name",
                  "Start Creation Date",
                  "End Creation Date",
                  "Start Purchase Date",
                  "End Purchase Date",
                  "Category",
                  "Remarks",
                  "Total Count",
                ]}
                PDFData={{
                  "Unit Name": data?.query_data?.unit_name || "All",
                  "Start Creation Date": data?.query_data?.start_date
                    ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "End Creation Date": data?.query_data?.end_date
                    ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "Start Purchase Date": data?.query_data?.start_purchase_date
                    ? dayjs(data?.query_data?.start_purchase_date).format(
                      "DD-MM-YYYY"
                    )
                    : "Not Applied",
                  "End Purchase Date": data?.query_data?.end_purchase_date
                    ? dayjs(data?.query_data?.end_purchase_date).format(
                      "DD-MM-YYYY"
                    )
                    : "Not Applied",
                  Category: data?.query_data?.category || "All",
                  Remarks: data?.query_data?.remarks || "All",
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

      {/* Additional Categories - Tabbed Design */}
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
                Asset Categories
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
                      .filter((item) => item.value > 0 || activeFilterCount === 0)
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
                        value: categoryData["24_port_switch_count"],
                      },
                      {
                        title: "48 Port Switches",
                        value: categoryData["48_port_switch_count"],
                      },
                      {
                        title: "Non-Manageable Switches",
                        value: categoryData.non_managable_switch_count,
                      },
                    ]
                      .filter((item) => item.value > 0 || activeFilterCount === 0)
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
                      .filter((item) => item.value > 0 || activeFilterCount === 0)
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
                      { title: "NVR/DVR", value: categoryData.nvr_drv_count },
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
                      .filter((item) => item.value > 0 || activeFilterCount === 0)
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
                Search Assets
              </Text>
              <Input
                size="middle"
                prefix={<SearchOutlined style={{ color: "#999" }} />}
                placeholder="Search by Asset, Serial, PO or Model No..."
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

          {/* Status */}
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Status
              </Text>
              <Select
                size="middle"
                style={{ width: "100%" }}
                placeholder="Select Status"
                allowClear
                value={filter.remarks}
                onChange={(e) => setFilter({ ...filter, remarks: e })}
              >
                <Option value="assigned">Assigned</Option>
                <Option value="in_stock">In Stock</Option>
              </Select>
            </Space>
          </Col>

          {/* Creation Date Range */}
          <Col xs={24} sm={12} md={9}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Creation Date Range
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
                disabledDate={(current) => current && current > dayjs().endOf("day")}
              />
            </Space>
          </Col>

          {/* Purchase Date Range */}
          <Col xs={24} sm={12} md={9}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Purchase Date Range
              </Text>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width: "100%" }}
                placeholder={["Start Date", "End Date"]}
                onChange={(_, e) =>
                  setFilter({
                    ...filter,
                    start_purchase_date: e[0],
                    end_purchase_date: e[1],
                  })
                }
                value={
                  filter.start_purchase_date && filter.end_purchase_date
                    ? [
                      dayjs(filter.start_purchase_date),
                      dayjs(filter.end_purchase_date),
                    ]
                    : undefined
                }
                disabledDate={(current) => current && current > dayjs().endOf("day")}
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
            {filter.remarks && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Status: {filter.remarks}
              </Tag>
            )}
            {filter.start_date && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Creation Date
              </Tag>
            )}
            {filter.start_purchase_date && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Purchase Date
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
                    ? `${data.query_data.report_generate_employee_name} (${data.query_data.report_generate_employee_id || ""
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

export default AssetReportModal;