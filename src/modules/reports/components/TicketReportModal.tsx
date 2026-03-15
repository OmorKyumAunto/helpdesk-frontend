import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
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
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import TicketReportPDFDownload from "./TicketReportPDFDownload";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import dayjs from "dayjs";
import { UserList } from "../../Unit/types/unitTypes";
import Lottie from "lottie-react";
import blueLoader from "../../../assets/blueloader.json";

const { Option } = Select;
const { Text } = Typography;

const TicketReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit || 0,
    { skip: !filter.unit },
  );

  const unitOption = useMemo(() => {
    const unitOptionForAdmin = unitData?.data?.filter((unit: any) =>
      profile?.data?.searchAccess?.some(
        (item: any) => item?.unit_id === unit?.id,
      ),
    );

    return profile?.data?.role_id === 2 || profile?.data?.role_id === 4
      ? unitOptionForAdmin
      : unitData?.data;
  }, [unitData?.data, profile?.data?.searchAccess, profile?.data?.role_id]);

  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });

  const { data, isLoading, isFetching } = useGetTicketReportQuery({
    ...filter,
  });

  const clearAllFilters = () => {
    setFilter({});
  };

  const activeFilterCount = Object.keys(filter).filter(
    (key) =>
      filter[key] !== undefined && filter[key] !== null && filter[key] !== "",
  ).length;

  const ticketList = data?.data || [];
  const totalTickets = data?.total || data?.query_data?.total_count || 0;

  const convertToMinutes = (value: number | string, unit?: string) => {
    const num = Number(value || 0);
    if (unit === "hours") return num * 60;
    if (unit === "days") return num * 24 * 60;
    return num;
  };

  const formatMinutesToText = (totalMinutes: number) => {
    if (!totalMinutes || totalMinutes <= 0) return "0 min";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} d`);
    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0) parts.push(`${minutes} min`);

    return parts.join(" ");
  };

  const getTicketSolveMinutes = (ticket: any) => {
    if (!ticket?.ticket_created_at || !ticket?.ticket_updated_at) return 0;

    const createdAt = dayjs(ticket.ticket_created_at);
    const updatedAt = dayjs(ticket.ticket_updated_at);

    if (!createdAt.isValid() || !updatedAt.isValid()) return 0;

    const diff = updatedAt.diff(createdAt, "minute");
    return diff > 0 ? diff : 0;
  };

  const getTicketResolveSLAMinutes = (ticket: any) => {
    return convertToMinutes(
      ticket.resolve_time_value,
      ticket.resolve_time_unit,
    );
  };

  const getTicketOverdueMinutes = (ticket: any) => {
    const solveMinutes = getTicketSolveMinutes(ticket);
    const slaMinutes = getTicketResolveSLAMinutes(ticket);
    const overdueMinutes = solveMinutes - slaMinutes;
    return overdueMinutes > 0 ? overdueMinutes : 0;
  };

  const solvedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "solved",
  );
  const inProgressTickets = ticketList.filter(
    (item: any) => item.ticket_status === "inprogress",
  ).length;
  const unsolvedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "unsolved",
  ).length;
  const forwardedTickets = ticketList.filter(
    (item: any) => item.ticket_status === "forward",
  ).length;

  const overdueTickets = ticketList.filter((item: any) => {
    const solveMinutes = getTicketSolveMinutes(item);
    const slaMinutes = getTicketResolveSLAMinutes(item);
    return solveMinutes > slaMinutes;
  }).length;

  const solvedWithinSLATickets = solvedTickets.filter((item: any) => {
    const solveMinutes = getTicketSolveMinutes(item);
    const slaMinutes = getTicketResolveSLAMinutes(item);
    return solveMinutes <= slaMinutes;
  }).length;

  const totalResolveSLAMinutes = solvedTickets.reduce(
    (sum: number, ticket: any) => sum + getTicketResolveSLAMinutes(ticket),
    0,
  );

  const totalRequiredMinutes = solvedTickets.reduce(
    (sum: number, ticket: any) => sum + getTicketSolveMinutes(ticket),
    0,
  );

  const totalSLABreakMinutes = Math.max(
    totalRequiredMinutes - totalResolveSLAMinutes,
    0,
  );

  const avgResolveSLAMinutes =
    solvedTickets.length > 0
      ? Math.floor(totalResolveSLAMinutes / solvedTickets.length)
      : 0;

  const avgSolveMinutes =
    solvedTickets.length > 0
      ? Math.floor(totalRequiredMinutes / solvedTickets.length)
      : 0;

  const solvedRate =
    totalTickets > 0
      ? Math.round((solvedTickets.length / totalTickets) * 100)
      : 0;

  const overdueRate =
    totalTickets > 0 ? Math.round((overdueTickets / totalTickets) * 100) : 0;

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
      {/* Header */}
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
          <Col xs={24} sm={24} md={16} lg={17} xl={18}>
            <Row gutter={[12, 12]}>
              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Total Tickets
                    </span>
                  }
                  value={totalTickets}
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#1890ff",
                  }}
                />
              </Col>

              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Solved
                    </span>
                  }
                  value={solvedTickets.length}
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#52c41a",
                  }}
                />
              </Col>

              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Solved Rate
                    </span>
                  }
                  value={solvedRate}
                  suffix="%"
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#722ed1",
                  }}
                />
              </Col>
            </Row>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={8}
            lg={7}
            xl={6}
            style={{
              textAlign:
                typeof window !== "undefined" && window.innerWidth > 768
                  ? "right"
                  : "center",
            }}
          >
            <Space
              wrap
              size={[8, 8]}
              style={{
                width: "100%",
                justifyContent:
                  typeof window !== "undefined" && window.innerWidth > 768
                    ? "flex-end"
                    : "center",
              }}
            >
              <ExcelDownload
                isLoading={isLoading || isFetching}
                excelName={"Ticket Report"}
                excelTableHead={[
                  "Ticket ID",
                  "Ticket Subject",
                  "Ticket Status",
                  "Category",
                  "Priority",
                  "Asset Serial Number",
                  "Raised By",
                  "Raiser ID",
                  "Raiser Seating Unit",
                  "Raiser Seating Building",
                  "Raiser Seating Location",
                  "Solved By",
                  "Admin ID",
                  "Resolve SLA Time",
                  "Solving Time",
                  "Overdue Time",
                  "Unit Name",
                ]}
                excelData={
                  ticketList.length
                    ? ticketList.map((item: any) => {
                        const solvingMinutes = getTicketSolveMinutes(item);
                        const resolveSLAMinutes =
                          getTicketResolveSLAMinutes(item);
                        const overdueMinutes = getTicketOverdueMinutes(item);

                        return {
                          "Ticket ID": item.ticket_id,
                          "Ticket Subject": item.subject,
                          "Ticket Status": item.ticket_status,
                          Category: item.ticket_category_title,
                          Priority: item.priority,
                          "Asset Serial Number": item.asset_serial_number,
                          "Raised By": item.ticket_created_employee_name,
                          "Raiser ID": item.ticket_created_employee_id,
                          "Raiser Seating Unit": item.seating_unit_name,
                          "Raiser Seating Building": item.complex_name,
                          "Raiser Seating Location": item.seating_location_name,
                          "Solved By": item.ticket_solved_employee_name,
                          "Admin ID": item.ticket_solved_employee_id,
                          "Resolve SLA Time":
                            formatMinutesToText(resolveSLAMinutes),
                          "Solving Time": formatMinutesToText(solvingMinutes),
                          "Overdue Time":
                            overdueMinutes > 0
                              ? formatMinutesToText(overdueMinutes)
                              : "N/A",
                          "Unit Name": item.asset_unit_title,
                        };
                      })
                    : []
                }
              />

              <TicketReportPDFDownload
                PDFFileName="ticket_report_query_data"
                fileHeader="Ticket Report"
                queryData={data?.query_data}
                ticketList={ticketList}
                PDFHeader={[
                  "Searching Keyword",
                  "Start Date",
                  "End Date",
                  "Category",
                  "Priority",
                  "Status",
                  "Unit Name",
                  "Total Count",
                ]}
                PDFData={{
                  "Searching Keyword": data?.query_data?.key || "Not Applied",
                  "Start Date": data?.query_data?.start_date
                    ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "End Date": data?.query_data?.end_date
                    ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  Category: data?.query_data?.category || "ALL",
                  Priority: data?.query_data?.priority || "ALL",
                  Status: data?.query_data?.status || "ALL",
                  "Unit Name": data?.query_data?.unit_name || "ALL",
                  "Total Count": totalTickets,
                }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Status Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #ff4d4f",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Overdue Tickets
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#ff4d4f",
                  lineHeight: 1.2,
                }}
              >
                {overdueTickets}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #faad14",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                In Progress
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#faad14",
                  lineHeight: 1.2,
                }}
              >
                {inProgressTickets}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #1890ff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Unsolved
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#1890ff",
                  lineHeight: 1.2,
                }}
              >
                {unsolvedTickets}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #52c41a",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Solved Within SLA
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#52c41a",
                  lineHeight: 1.2,
                }}
              >
                {solvedWithinSLATickets}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
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
            {
              title: "Total Resolve SLA Time",
              value: formatMinutesToText(totalResolveSLAMinutes),
            },
            {
              title: "Required Total Solve Time",
              value: formatMinutesToText(totalRequiredMinutes),
            },
            {
              title: "SLA Break Time",
              value: formatMinutesToText(totalSLABreakMinutes),
            },
            {
              title: "Avg Resolve SLA",
              value: formatMinutesToText(avgResolveSLAMinutes),
            },
            {
              title: "Avg Solve Time",
              value: formatMinutesToText(avgSolveMinutes),
            },
            {
              title: "Overdue Rate",
              value: `${overdueRate}%`,
            },
          ].map((item, idx) => (
            <Col xs={12} sm={8} md={8} lg={8} xl={8} key={idx}>
              <div
                style={{
                  background: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: 4,
                  padding: "clamp(8px, 2vw, 12px)",
                  textAlign: "center",
                  minHeight: 72,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  wordBreak: "break-word",
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: "clamp(9px, 1.5vw, 11px)",
                    display: "block",
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 14px)",
                    color: "#262626",
                    lineHeight: 1.3,
                  }}
                >
                  {item.value}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Filters */}
      <Card
        size="small"
        title={
          <Space size="small">
            <FilterOutlined style={{ fontSize: 14 }} />
            <span
              style={{
                fontSize: "clamp(12px, 2vw, 14px)",
                fontWeight: 600,
              }}
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
          <Space size={4} wrap>
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
                    display:
                      typeof window !== "undefined" && window.innerWidth > 480
                        ? "inline"
                        : "none",
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
          <Col xs={24}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Search Tickets
              </Text>
              <Input
                prefix={<SearchOutlined style={{ color: "#999" }} />}
                onChange={(e) => setFilter({ ...filter, key: e.target.value })}
                placeholder="Search tickets..."
                allowClear
                value={filter.key}
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
                Unit Name
              </Text>
              <Select
                style={{ width: "100%" }}
                loading={unitIsLoading}
                placeholder="Select Unit Name"
                showSearch
                optionFilterProp="children"
                onChange={(e) =>
                  setFilter({ ...filter, unit: e, user_id: undefined })
                }
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
              </Text>
              <Select
                loading={adminLoading}
                placeholder="Search Admin"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
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

          <Col xs={24} sm={12} md={8}>
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
                style={{ width: "100%" }}
                loading={categoryLoading}
                placeholder="Select Category"
                showSearch
                optionFilterProp="children"
                onChange={(e) =>
                  setFilter({ ...filter, category: e, offset: 0 })
                }
                options={categoryData?.data?.map((item: any) => ({
                  value: item.id,
                  label: item.title,
                }))}
                allowClear
                value={filter.category}
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
                Status
              </Text>
              <Select
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, status: e })}
                placeholder="Select Status"
                allowClear
                value={filter.status}
              >
                <Option value="inprogress">IN PROGRESS</Option>
                <Option value="solved">SOLVED</Option>
                <Option value="unsolved">UNSOLVED</Option>
                <Option value="forward">FORWARD</Option>
              </Select>
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
                Priority
              </Text>
              <Select
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, priority: e })}
                placeholder="Select Priority"
                allowClear
                value={filter.priority}
              >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
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
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
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
                Search
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
            {filter.user_id && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Admin
              </Tag>
            )}
            {filter.category && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Category
              </Tag>
            )}
            {filter.status && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Status
              </Tag>
            )}
            {filter.priority && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Priority
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
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 13px)",
                    wordBreak: "break-word",
                  }}
                >
                  {data.query_data.unit_name || "N/A"}
                </Text>
              </Space>
            </Col>

            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Employee
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 13px)",
                    wordBreak: "break-word",
                  }}
                >
                  {data.query_data.employee_name
                    ? `${data.query_data.employee_name} (${
                        data.query_data.employee_id || ""
                      })`
                    : "N/A"}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default TicketReportModal;
