import {
  Col,
  DatePicker,
  Row,
  Select,
  Card,
  Space,
  Button,
  Statistic,
  Badge,
  Typography,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  FilterOutlined,
  ClearOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import { rangePreset } from "../../../common/rangePreset";
import dayjs from "dayjs";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetCombineReportQuery } from "../api/reportsEndPoints";
import CombineReportPDFDownload from "./PDFDownloadForCombineReport";

const { Title, Text } = Typography;

const CombineReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: allAdmin, isLoading: adminLoading } =
    useGetAdminWiseUnitsQuery(filter.unit || 0, { skip: !filter.unit });
  const { data } = useGetCombineReportQuery({ ...filter });

  const clearAllFilters = () => setFilter({});
  const activeFilterCount = Object.keys(filter).filter(
    (key) => filter[key] !== undefined && filter[key] !== null && filter[key] !== ""
  ).length;

  const report: any = data?.data || {};

  const formatTimeNoSeconds = (timeString: string | undefined | null) => {
    if (!timeString && timeString !== "") return "N/A";
    if (typeof timeString !== "string") return String(timeString ?? "N/A");
    const cleaned = timeString.split(".")[0];
    const parts = cleaned.split(":").map((p) => parseInt(p, 10));
    if (parts.length >= 2 && !parts.some(isNaN)) {
      const [h, m] = parts;
      if (h === 0 && m === 0) return "0 min";
      if (h === 0) return `${m} min`;
      if (m === 0) return `${h} hr`;
      return `${h} hr ${m} min`;
    }
    return timeString;
  };

  return (
    <div style={{ 
      padding: "clamp(8px, 2vw, 16px)",
      background: "#f5f5f5"
    }}>
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
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={18} lg={18}>
            <Row gutter={[12, 12]}>
              <Col xs={8} sm={8}>
                <Statistic
                  title={<span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#666" }}>Total Tickets</span>}
                  value={report.ticket_task_count?.total_ticket ?? 0}
                  valueStyle={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "#1890ff" }}
                />
              </Col>
              <Col xs={8} sm={8}>
                <Statistic
                  title={<span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#666" }}>Total Tasks</span>}
                  value={report.ticket_task_count?.total_task ?? 0}
                  valueStyle={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "#52c41a" }}
                />
              </Col>
              <Col xs={8} sm={8}>
                <Statistic
                  title={<span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#666" }}>Combined</span>}
                  value={report.ticket_task_count?.total_ticket_task ?? 0}
                  valueStyle={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "#722ed1" }}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} style={{ textAlign: window.innerWidth > 768 ? 'right' : 'center' }}>
            <CombineReportPDFDownload
              PDFFileName="combine_report_query_data"
              fileHeader="Combined Report"
              queryData={data?.query_data!}
              PDFHeader={[
                "Total Tickets",
                "Total Tasks",
                "Total Ticket+Task",
                "In-time Ticket",
                "In-time Task",
                "Ticket Overdue",
                "Task Overdue",
                "Avg Ticket Time",
                "Avg Task Time",
                "Avg Ticket+Task",
                "Ticket SLA Avg",
                "Task SLA Avg",
                "Total Work Sum",
                "Total SLA Sum",
                "Work/Day",
                "SLA/Day",
                "Total Working Days",
                "From Date",
                "To Date",
                "Assigned Unit",
                "Assigned Admin",
              ]}
              PDFData={{
                "Total Tickets": report.ticket_task_count?.total_ticket ?? 0,
                "Total Tasks": report.ticket_task_count?.total_task ?? 0,
                "Total Ticket+Task": report.ticket_task_count?.total_ticket_task ?? 0,
                "In-time Ticket": report.ticket_task_count?.in_time_ticket ?? "N/A",
                "In-time Task": report.ticket_task_count?.in_time_task ?? "N/A",
                "Ticket Overdue": report.ticket_task_count?.ticket_overdue_count ?? "N/A",
                "Task Overdue": report.ticket_task_count?.task_overdue_count ?? "N/A",
                "Avg Ticket Time": report.ticket_task_count?.avg_ticket_time ?? "N/A",
                "Avg Task Time": report.ticket_task_count?.avg_task_time ?? "N/A",
                "Avg Ticket+Task": report.ticket_task_count?.avg_ticket_task_time ?? "N/A",
                "Ticket SLA Avg": report.ticket_time_calculation?.total_ticket_sla_time_avg ?? "N/A",
                "Task SLA Avg": report.task_time_calculation?.total_task_sla_time_avg ?? "N/A",
                "Total Work Sum": report.total_work_sum ?? "N/A",
                "Total SLA Sum": report.total_sla_sum ?? "N/A",
                "Work/Day": report.per_day_wise_work ?? "N/A",
                "SLA/Day": report.per_day_wise_sla ?? "N/A",
                "Total Working Days": report.total_working_day ?? "N/A",
                "From Date": data?.query_data?.start_date
                  ? dayjs(data.query_data.start_date).format("DD-MM-YYYY")
                  : "Not Applied",
                "To Date": data?.query_data?.end_date
                  ? dayjs(data.query_data.end_date).format("DD-MM-YYYY")
                  : "Not Applied",
                "Assigned Unit":
                  data?.query_data?.admin_assign_unit_name ||
                  data?.query_data?.unit_name ||
                  "Not Applied",
                "Assigned Admin": data?.query_data?.report_generate_employee_name || "Not Applied",
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Status Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #ff4d4f",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                Ticket Overdue
              </Text>
              <Text strong style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#ff4d4f" }}>
                {report.ticket_task_count?.ticket_overdue_count ?? 0}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #faad14",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                Task Overdue
              </Text>
              <Text strong style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#faad14" }}>
                {report.ticket_task_count?.task_overdue_count ?? 0}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #1890ff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                In-time Tickets
              </Text>
              <Text strong style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#1890ff" }}>
                {report.ticket_task_count?.in_time_ticket ?? 0}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #52c41a",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                In-time Tasks
              </Text>
              <Text strong style={{ fontSize: "clamp(16px, 3vw, 20px)", color: "#52c41a" }}>
                {report.ticket_task_count?.in_time_task ?? 0}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      {report && (
        <Card
          size="small"
          bordered={false}
          title={
            <Space size="small">
              <BarChartOutlined style={{ fontSize: 14 }} />
              <span style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 600 }}>
                Performance Metrics
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
          <Row gutter={[12, 12]}>
            {[
              { title: "Avg Ticket Time", value: report.ticket_task_count?.avg_ticket_time },
              { title: "Avg Task Time", value: report.ticket_task_count?.avg_task_time },
              { title: "Avg Combined Time", value: report.ticket_task_count?.avg_ticket_task_time },
              { title: "Work Time/Day", value: report.per_day_wise_work },
              { title: "SLA Time/Day", value: report.per_day_wise_sla },
              { title: "Working Days", value: report.total_working_day },
            ].map((item, idx) => (
              <Col xs={12} sm={8} md={8} lg={8} xl={4} key={idx}>
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
                    {formatTimeNoSeconds(item.value)}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Filters */}
      <Card
        size="small"
        title={
          <Space size="small">
            <FilterOutlined style={{ fontSize: 14 }} />
            <span style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 600 }}>
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
                <span style={{ display: window.innerWidth > 480 ? "inline" : "none" }}>
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
          <Col xs={24} sm={12} md={8}>
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
                optionFilterProp="children"
                onChange={(e) => setFilter({ ...filter, unit: e })}
                options={unitData?.data?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                allowClear
                value={filter.unit}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Admin
              </Text>
              <Select
                size="middle"
                loading={adminLoading}
                placeholder="Select Admin"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={allAdmin?.data?.user_list?.map((item: UserList) => ({
                  value: item.user_id,
                  label: `[${item.employee_id}] ${item.name}`,
                }))}
                onChange={(e) => setFilter({ ...filter, user_id: e })}
                allowClear
                style={{ width: "100%" }}
                value={filter.user_id}
              />
            </Space>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Date Range
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
            <Text strong style={{ fontSize: "clamp(11px, 1.5vw, 12px)", color: "#0050b3" }}>
              Active:
            </Text>
            {filter.unit && (
              <Tag color="blue" style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}>
                Unit
              </Tag>
            )}
            {filter.user_id && (
              <Tag color="blue" style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}>
                Admin
              </Tag>
            )}
            {filter.start_date && (
              <Tag color="blue" style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}>
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
                <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                  Report For
                </Text>
                <Text strong style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>
                  {data.query_data.admin_assign_unit_name ||
                    data.query_data.unit_name ||
                    "N/A"}
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                  Employee
                </Text>
                <Text strong style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>
                  {data.query_data.employee_name
                    ? `${data.query_data.employee_name} (${data.query_data.employee_id || ""})`
                    : "N/A"}
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text type="secondary" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
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

export default CombineReportModal;