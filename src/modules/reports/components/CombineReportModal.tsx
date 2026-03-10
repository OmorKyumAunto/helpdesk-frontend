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
import { useEffect, useMemo, useState } from "react";
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
import Lottie from "lottie-react";
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
import blueLoader from "../../../assets/blueloader.json";

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

  const unitOption = useMemo(() => {
    const unitOptionForAdmin = unitData?.data?.filter((unit) =>
      profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
    );

    return (profile?.data?.role_id === 2 || profile?.data?.role_id === 4)
      ? unitOptionForAdmin
      : unitData?.data;
  }, [unitData?.data, profile?.data?.searchAccess, profile?.data?.role_id]);

  const { data: allAdmin, isLoading: adminLoading } =
    useGetAdminWiseUnitsQuery(filter.unit || 0, { skip: !filter.unit });
  const { data, isLoading: reportLoading } = useGetCombineReportQuery({ ...filter });

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

  const calculateSLABreakTime = () => {
    const workTime = report.per_day_wise_work;
    const slaTime = report.per_day_wise_sla;

    if (!workTime || !slaTime) return "N/A";

    try {
      // Parse time strings to minutes
      const parseTimeToMinutes = (timeStr: string) => {
        const cleaned = timeStr.split(".")[0];
        const parts = cleaned.split(":").map((p) => parseInt(p, 10));
        if (parts.length >= 2 && !parts.some(isNaN)) {
          const [h, m] = parts;
          return h * 60 + m;
        }
        return 0;
      };

      const workMinutes = parseTimeToMinutes(workTime);
      const slaMinutes = parseTimeToMinutes(slaTime);
      const breakMinutes = workMinutes - slaMinutes;

      if (breakMinutes < 0) return "0 min";

      const hours = Math.floor(breakMinutes / 60);
      const minutes = breakMinutes % 60;

      if (hours === 0 && minutes === 0) return "0 min";
      if (hours === 0) return `${minutes} min`;
      if (minutes === 0) return `${hours} hr`;
      return `${hours} hr ${minutes} min`;
    } catch (error) {
      return "N/A";
    }
  };

  // Loading state
  if (reportLoading) {
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
                  title={<span style={{ fontSize: "clamp(10px, 1.5vw, 12px)", color: "#666" }}>Total Combined</span>}
                  value={report.ticket_task_count?.total_ticket_task ?? 0}
                  valueStyle={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 600, color: "#3c0091ff" }}
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
                "Total Ticket and Task",
                "In-time Solved Ticket",
                "In-time Solved Task",
                "Ticket Overdue",
                "Task Overdue",
                "Avg Ticket Time",
                "Avg Task Time",
                "Avg Ticket and Task",
                "Working Time Per Day",
                "SLA Wise Should Be Completed Per Day",
                "Total Working Days",
                "From Date",
                "To Date",
                "Assigned Unit",
                "Report Generated By",
              ]}
              PDFData={{
                "Total Tickets": report.ticket_task_count?.total_ticket ?? 0,
                "Total Tasks": report.ticket_task_count?.total_task ?? 0,
                "Total Ticket and Task": report.ticket_task_count?.total_ticket_task ?? 0,
                "In-time Solved Ticket": report.ticket_task_count?.in_time_ticket ?? "N/A",
                "In-time Solved Task": report.ticket_task_count?.in_time_task ?? "N/A",
                "Ticket Overdue": report.ticket_task_count?.ticket_overdue_count ?? "N/A",
                "Task Overdue": report.ticket_task_count?.task_overdue_count ?? "N/A",
                "Avg Ticket Time": report.ticket_task_count?.avg_ticket_time ?? "N/A",
                "Avg Task Time": report.ticket_task_count?.avg_task_time ?? "N/A",
                "Avg Ticket and Task": report.ticket_task_count?.avg_ticket_task_time ?? "N/A",
                "Working Time Per Day": report.per_day_wise_work ?? "N/A",
                "SLA Wise Should Be Completed Per Day": report.per_day_wise_sla ?? "N/A",
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
                "Report Generated By":
                  data?.query_data?.report_generate_employee_name || "Not Applied",
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Status Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={12} sm={12} md={12} lg={4} xl={6}>
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

        <Col xs={12} sm={12} md={12} lg={4} xl={6}>
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

        <Col xs={12} sm={12} md={8} lg={4} xl={6}>
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

        <Col xs={12} sm={12} md={8} lg={4} xl={6}>
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
              { title: "Working Time Per Day Without SLA", value: report.per_day_wise_work },
              { title: "Work Should Be Completed With SLA", value: report.per_day_wise_sla },
              { title: "SLA Break Time", value: calculateSLABreakTime(), isCalculated: true },
            ].map((item, idx) => (
              <Col xs={12} sm={8} md={8} lg={8} xl={8} key={idx}>
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
                    {item.isCalculated ? item.value : formatTimeNoSeconds(item.value)}
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
              {/* <Select
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
              /> */}
              <Select
                size="middle"
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit"
                showSearch
                optionFilterProp="children"
                onChange={(e) => setFilter({ ...filter, unit: e })}
                options={unitOption?.map((unit: any) => ({
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
                {filter.unit && (
                  <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
                )}
              </Text>
              <Select
                size="middle"
                loading={adminLoading}
                placeholder={filter.unit ? "Select Admin (Required)" : "Select Admin"}
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
                allowClear={!filter.unit}
                style={{
                  width: "100%",
                }}
                status={filter.unit && !filter.user_id ? "error" : undefined}
                value={filter.user_id}
                disabled={!filter.unit}
              />
              {filter.unit && !filter.user_id && (
                <Text type="danger" style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}>
                  Please select an admin
                </Text>
              )}
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