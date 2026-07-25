import { Card, Col, Grid, Progress, Row, Space, Table, Typography } from "antd";
import { Tooltip as AntdTooltip } from "antd";
import {
  FaTicketAlt,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";
import { IoCaretForwardCircle } from "react-icons/io5";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PieChartWithLabels from "./PieChart";
import "./ticket-dashboard.css";
import {
  useGetDashboardBarDataQuery,
  useGetPriorityWiseDashboardDataQuery,
  useGetRaiseSolveDashboardDataQuery,
  useGetTicketDashboardCountQuery,
  useGetTopTicketSolverQuery,
} from "../api/ticketEndpoint";

interface TicketDashboardProps {
  setActiveKey: (key: string) => void;
  setTicketValue: (key: string) => void;
  setTicketPriorityValue: (key: string) => void;
  setTicketSolver?: (key: string) => void;
  roleID: number;
}

const TicketDashboard = ({
  setActiveKey,
  roleID,
  setTicketValue,
  setTicketPriorityValue,
  setTicketSolver,
}: TicketDashboardProps) => {
  const screens = Grid.useBreakpoint();
  const isXs = !screens.sm; // reactive < 576px
  const { data } = useGetTicketDashboardCountQuery();
  const { data: topSolver } = useGetTopTicketSolverQuery();
  const { data: raiseSolved } = useGetRaiseSolveDashboardDataQuery();
  const { data: priority } = useGetPriorityWiseDashboardDataQuery();
  const { data: barData } = useGetDashboardBarDataQuery();

  const ticketPriorityCards = [
    {
      id: 1,
      title: "Total Ticket",
      value: "",
      data: data?.data?.total_ticket,
      color: "rgba(61,91,241,255)",
      icon: <FaTicketAlt size={28} />,
    },
    {
      id: 2,
      title: "Solved",
      value: "solved",
      data: data?.data?.total_solve,
      color: "rgba(32,149,135,255)",
      icon: <FaCheckCircle size={28} />,
    },
    {
      id: 3,
      title: "In Progress",
      value: "inprogress",
      data: data?.data?.total_inprogress,
      color: "rgba(134,1,176,255)",
      icon: <ImSpinner9 size={28} />,
    },
    {
      id: 4,
      title: "Unsolved",
      value: "unsolved",
      data: data?.data?.total_unsolved,
      color: "rgba(254,39,18,255)",
      icon: <FaExclamationCircle size={28} />,
    },
    {
      id: 5,
      title: "Forward",
      value: "forward",
      data: data?.data?.total_forward,
      color: "rgba(0,73,153,255)",
      icon: <IoCaretForwardCircle size={28} />,
    },
    {
      id: 6,
      title: "Avg. Time",
      value: "total_avg_time",
      data: data?.data?.total_avg_time,
      color: "rgba(158,46,40,255)",
      icon: <IoTimerOutline size={28} />,
    },
  ];

  const ticketData = barData?.data || [];

  return (
    <Card className="tk-dash" style={{ width: "100%" }}>
      <Row gutter={[12, 12]}>
        {ticketPriorityCards?.map((item) => (
          <Col key={item.id} xs={12} sm={8} lg={4}>
            <Card
              className="card-hover-stat"
              onClick={() => {
                // Skip Avg. Time
                if (item.value === "total_avg_time") return;

                // Total Ticket only works for role 1
                if (item.value === "" && roleID !== 1) return;

                if (setActiveKey) {
                  if (roleID === 1) {
                    setActiveKey("2");
                  } else if (roleID === 2) {
                    setActiveKey(item.value === "solved" ? "5" : "10");
                  } else if (roleID === 4) {
                    setActiveKey(item.value === "solved" ? "13" : "12");
                  } else {
                    setActiveKey("5"); // fallback
                  }
                }

                if (setTicketValue) {
                  setTicketValue(item.value);
                }
              }}
              style={{
                textAlign: "center",
                backgroundColor: item.color,
                color: "white",
                borderRadius: "15px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div>{item.icon}</div>
              <h3>{item.title}</h3>
              <h2>{item.data}</h2>

              <style>
                {`
          .card-hover-stat {
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover-stat:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          }
          .card-hover-stat::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.05) 100%
            );
            mix-blend-mode: overlay;
            opacity: 0.9;
            animation: pulse 3s infinite ease-in-out;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 0.7; }
          }
        `}
              </style>
            </Card>
          </Col>
        ))}

        {/* Priority based */}
        <Col xs={24} sm={24} md={24} lg={5}>
          <Card
            className="tk-card"
            title="Priority Overview"
            style={{ height: "380px", display: "flex", flexDirection: "column" }}
            bodyStyle={{ padding: "12px", flex: 1, minHeight: 0 }}
          >
            {(() => {
              const items = [
                { label: "Urgent", count: priority?.data?.priority_urgent || 0, color: "#ef4444", value: "urgent" },
                { label: "High", count: priority?.data?.priority_high || 0, color: "#3b82f6", value: "high" },
                { label: "Medium", count: priority?.data?.priority_medium || 0, color: "#f59e0b", value: "medium" },
                { label: "Low", count: priority?.data?.priority_low || 0, color: "#22c55e", value: "low" },
              ];
              const total = items.reduce((s, i) => s + i.count, 0) || 1;
              return (
                <div className="po-list">
                  {items.map(({ label, count, color, value }) => (
                    <button
                      key={label}
                      type="button"
                      className="po-item"
                      style={{ ["--c" as any]: color }}
                      onClick={() => {
                        if (setActiveKey) {
                          if (roleID === 1) setActiveKey("2");
                          else if (roleID === 4) setActiveKey("13");
                          else setActiveKey("5");
                        }
                        setTicketPriorityValue && setTicketPriorityValue(value);
                      }}
                    >
                      <span className="po-item__badge">{count}</span>
                      <span className="po-item__body">
                        <span className="po-item__top">
                          <span className="po-item__label">{label}</span>
                          <span className="po-item__pct">
                            {Math.round((count / total) * 100)}%
                          </span>
                        </span>
                        <span className="po-item__bar">
                          <span style={{ width: `${(count / total) * 100}%` }} />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              );
            })()}
          </Card>
        </Col>

        {/* Pie Chart Component */}
        <Col xs={24} sm={24} md={24} lg={13}>
          <Card
            className="tk-card"
            title="Category Wise Tickets"
            style={{ width: "100%", height: "380px" }}
          >
            <PieChartWithLabels />
          </Card>
        </Col>

        {/* Top Ticket Solver  */}
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
        >
          <Card
            title={
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#1f2937",
                fontWeight: "600",
                fontSize: isXs ? "14px" : "16px"
              }}>
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "22px"
                }}>
                  🏆
                </div>
                Top Ticket Solvers
              </div>
            }
            className="tk-card tk-solvers"
            style={{
              height: "380px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: "#ffffff"
            }}
            bodyStyle={{
              padding: "0 0 8px 0",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: "0" }}>
              <Table
                size="small"
                bordered={false}
                pagination={false}
                scroll={{ y: 290 }}
                showHeader={false}
                columns={[
                  {
                    title: "Solver",
                    width: "100%",
                    render: (record, _, index) => (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: isXs ? "10px 6px" : "12px 8px",
                          background: "#ffffff",
                          borderBottom: "1px solid #f3f4f6",
                          transition: "background-color 0.2s ease",
                          cursor: roleID === 1 ? "pointer" : "default"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                        }}
                        onClick={() => {
                          if (roleID === 1) {
                            setActiveKey && setActiveKey("3");
                            setTicketSolver && setTicketSolver(record?.solved_by_name);
                          }
                        }}
                      >
                        {/* Rank Number */}
                        <div style={{
                          width: isXs ? "20px" : "24px",
                          height: isXs ? "20px" : "24px",
                          background: index < 3 ? "#3b82f6" : "#6b7280",
                          color: "white",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isXs ? "10px" : "12px",
                          fontWeight: "600",
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>

                        {/* User Info */}
                        <div style={{
                          flex: 1,
                          marginLeft: isXs ? "8px" : "12px",
                          minWidth: 0
                        }}>
                          <AntdTooltip
                            title={
                              <div style={{ lineHeight: "1.6" }}>
                                <p style={{ margin: "4px 0" }}>
                                  <strong>Name:</strong> {record?.solved_by_name}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                  <strong>ID:</strong> {record?.employee_id}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                  <strong>Email:</strong> {record?.email}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                  <strong>Phone:</strong> {record?.contact_no}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                  <strong>Unit:</strong> {record?.unit_name}
                                </p>
                                <p style={{ margin: "4px 0 0 0" }}>
                                  <strong>Total Solved Tickets:</strong> {record?.solved_ticket_count}
                                </p>
                              </div>
                            }
                            placement="left"
                          >
                            <div>
                              <div style={{
                                fontWeight: "500",
                                fontSize: isXs ? "12px" : "14px",
                                color: roleID === 1 ? "#1d4ed8" : "#374151",
                                marginBottom: "2px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}>
                                {record?.solved_by_name}
                              </div>
                              <div style={{
                                fontSize: isXs ? "10px" : "12px",
                                color: "#6b7280",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}>
                                {record?.unit_name}
                              </div>
                            </div>
                          </AntdTooltip>
                        </div>

                        {/* Tickets Count */}
                        <div style={{
                          background: "#f3f4f6",
                          color: "#374151",
                          fontWeight: "600",
                          fontSize: isXs ? "12px" : "14px",
                          padding: isXs ? "3px 6px" : "4px 8px",
                          borderRadius: "4px",
                          minWidth: isXs ? "30px" : "40px",
                          textAlign: "center",
                          marginLeft: isXs ? "4px" : "8px"
                        }}>
                          {record?.solved_ticket_count}
                        </div>
                      </div>
                    ),
                  },
                ]}
                dataSource={topSolver?.data?.length ? topSolver?.data : []}
                rowClassName={() => ""}
                style={{
                  borderRadius: "4px",
                  overflow: "hidden"
                }}
              />
            </div>
          </Card>
        </Col>

        {/* Bar Chart */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card className="tk-card" title="Last 12 Months Ticket Count">
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart
                  data={ticketData}
                  barGap={3}
                  barCategoryGap="26%"
                  margin={{ top: 8, right: 8, bottom: 0, left: -14 }}
                >
                  <CartesianGrid vertical={false} stroke="#e8ecf2" />
                  <XAxis
                    dataKey="name"
                    axisLine={{ stroke: "#c3c2b7" }}
                    tickLine={false}
                    tick={{ fill: "#898781", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#898781", fontSize: 12 }}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(37,99,235,0.06)" }}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #e8ecf2",
                      fontSize: 12,
                      boxShadow: "0 8px 24px -12px rgba(16,24,40,.4)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, color: "#52514e", paddingTop: 4 }}
                  />
                  <Bar
                    dataKey="raiseTickets"
                    fill="#2563eb"
                    name="Raise Tickets"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="solvedTickets"
                    fill="#1baf7a"
                    name="Solved Tickets"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="unsolvedTickets"
                    fill="#e34948"
                    name="Unsolved Tickets"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Last 30 Days */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card className="tk-card" title="Last 30 Days" style={{ height: "100%" }}>
            <Space
              direction="vertical"
              style={{ height: 200, width: "100%", fontSize: "1px" }}
            >
              <div>
                <Typography.Title
                  level={5}
                  style={{ margin: "0px", fontSize: "14px" }}
                >
                  Raise Tickets
                </Typography.Title>
                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_ticket || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_ticket_percent || 0}%
                  </Typography.Text>
                </Space>
                <Progress
                  percent={raiseSolved?.data?.total_ticket_percent || 0}
                  style={{ color: "#1775bb" }}
                  showInfo={false}
                  status="normal"
                />
              </div>
              <div>
                <Typography.Title
                  level={5}
                  style={{ margin: "0px", fontSize: "14px" }}
                >
                  Solved Tickets
                </Typography.Title>

                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_solved || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_solved_percent || 0}%
                  </Typography.Text>
                </Space>
                <Progress
                  percent={raiseSolved?.data?.total_solved_percent || 0}
                  style={{ color: "#8dc73f" }}
                  showInfo={false}
                  status="success"
                />
              </div>
              <div>
                <Typography.Title
                  level={5}
                  style={{ margin: "0px", fontSize: "14px" }}
                >
                  Unsolved Tickets
                </Typography.Title>
                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_unsolved || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_unsolved_percent || 0}%
                  </Typography.Text>
                </Space>
                <Progress
                  percent={raiseSolved?.data?.total_unsolved_percent || 0}
                  style={{ color: "#ff4d4f" }}
                  showInfo={false}
                  status="exception"
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      {/* <ServiceDashboard /> */}
    </Card>
  );
};

export default TicketDashboard;
