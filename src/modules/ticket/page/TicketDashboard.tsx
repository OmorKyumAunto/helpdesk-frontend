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
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PieChartWithLabels from "./PieChart";
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
  const { md, lg } = Grid.useBreakpoint();
  const { data } = useGetTicketDashboardCountQuery();
  const { data: topSolver } = useGetTopTicketSolverQuery();
  const { data: raiseSolved } = useGetRaiseSolveDashboardDataQuery();
  const { data: priority } = useGetPriorityWiseDashboardDataQuery();
  const { data: barData } = useGetDashboardBarDataQuery();

  const ticketPriorityCards = [
    {
      id: 1,
      title: "All Ticket",
      value: "",
      data: data?.data?.total_ticket,
      color: "rgba(61,91,241,255)", // Orange for All Ticket
      icon: <FaTicketAlt size={28} />, // Ticket icon for "All Ticket"
    },
    {
      id: 2,
      title: "Solved",
      value: "solved",
      data: data?.data?.total_solve,
      color: "rgba(32,149,135,255)", // Green for Solved
      icon: <FaCheckCircle size={28} />, // Check circle icon for "Solved"
    },
    {
      id: 3,
      title: "In Progress",
      value: "inprogress",
      data: data?.data?.total_inprogress,
      color: "rgba(134,1,176,255)", // Purple for In Progress
      icon: <ImSpinner9 size={28} />, // Spinner icon for "In Progress"
    },
    {
      id: 4,
      title: "Unsolved",
      value: "unsolved",
      data: data?.data?.total_unsolved,
      color: "rgba(254,39,18,255)", // Red for Unsolved
      icon: <FaExclamationCircle size={28} />, // Exclamation circle for "Unsolved"
    },
    {
      id: 5,
      title: "Forward",
      value: "forward",
      data: data?.data?.total_forward,
      color: "rgba(0,73,153,255)", // Blue for Forward
      icon: <IoCaretForwardCircle size={28} />, // Arrow icon for "Forward"
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
    <Card style={{ width: "100%" }}>
      <Row gutter={[12, 12]}>
        {ticketPriorityCards?.map((item) => (
          <Col
            key={item.id}
            style={{ width: lg ? "16.6%" : md ? "50%" : "100%" }}
          >
            <Card
              className="card-hover-stat"
              onClick={() => {
                setActiveKey &&
                  item.value !== "total_avg_time" &&
                  setActiveKey(roleID === 1 ? "2" : "5");
                setTicketValue &&
                  item.value !== "total_avg_time" &&
                  setTicketValue(item.value);
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
              <div>
                {item.icon} {/* Dynamic icon rendering */}
              </div>
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
            0%, 100% {
              transform: scale(1);
              opacity: 0.9;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.7;
            }
          }
        `}
              </style>
            </Card>
          </Col>
        ))}

        {/* Priority based */}
        <Col xs={24} sm={24} md={24} lg={5}>
          <Card
            title={
              <span
                style={{ fontWeight: "600", fontSize: "16px", color: "#333" }}
              >
                Priority Overview
              </span>
            }
            style={{
              height: "auto",
              borderRadius: "16px",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            bodyStyle={{ padding: "10px" }} // Reduced padding
          >
            <Space
              direction="vertical"
              style={{
                height: "260px",

                width: "100%",
                gap: "4px", // Reduced gap between cards
                marginTop: "0px", // Ensures no extra space above the first card
              }}
            >
              {[
                {
                  label: "Urgent",
                  count: priority?.data?.priority_urgent || 0,
                  color: "#ff4d4f",
                  value: "urgent",
                },
                {
                  label: "High",
                  count: priority?.data?.priority_high || 0,
                  color: "#1890ff",
                  value: "high",
                },
                {
                  label: "Medium",
                  count: priority?.data?.priority_medium || 0,
                  color: "#faad14",
                  value: "medium",
                },
                {
                  label: "Low",
                  count: priority?.data?.priority_low || 0,
                  color: "#52c41a",
                  value: "low",
                },
              ].map(({ label, count, color, value }) => (
                <Card
                  key={label}
                  onClick={() => {
                    setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                    setTicketPriorityValue && setTicketPriorityValue(value);
                  }}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    border: "1px solid #f0f0f0",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  hoverable
                  bodyStyle={{
                    display: "flex",
                    alignItems: "center",
                    padding: "7px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <div
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12px",
                      marginRight: "14px",
                    }}
                  >
                    {count}
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "14px",
                        color: "#333",
                      }}
                    >
                      {label}
                    </span>
                    <br />
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      Tickets
                    </span>
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Pie Chart Component */}
        <Col xs={24} sm={24} md={24} lg={13}>
          <Card
            title="Category Wise Tickets"
            style={{
              width: "100%",
              height: "335px",
            }}
          >
            <PieChartWithLabels />
          </Card>
        </Col>

        {/* Top Ticket Solver  */}

        <Col xs={24} sm={24} md={24} lg={6}>
          <Card
            title="Top Ticket Solvers"
            style={{
              height: "335px",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f0f0f0",
            }}
          >
            <Table
              size="small"
              bordered={false}
              pagination={false}
              columns={[
                {
                  title: "Name",
                  render: (record) => (
                    <AntdTooltip
                      title={
                        <div style={{ lineHeight: "1.6" }}>
                          <p>
                            <strong>Name:</strong> {record?.solved_by_name}
                          </p>
                          <p>
                            <strong>ID:</strong> {record?.employee_id}
                          </p>
                          <p>
                            <strong>Email:</strong> {record?.email}
                          </p>
                          <p>
                            <strong>Phone No:</strong> {record?.contact_no}
                          </p>
                          <p>
                            <strong>Unit:</strong> {record?.unit_name}
                          </p>
                          <p>
                            <strong>Total Solved Tickets:</strong>{" "}
                            {record?.solved_ticket_count}
                          </p>
                        </div>
                      }
                    >
                      <span
                        style={{
                          fontWeight: 400,
                          fontSize: ".8em",
                          cursor: "pointer",
                          color: "#1775bb",
                          transition: "color 0.3s ease",
                        }}
                        onClick={() => {
                          if (roleID === 1) {
                            setActiveKey && setActiveKey("3");
                            setTicketSolver &&
                              setTicketSolver(record?.solved_by_name);
                          }
                        }}
                        onMouseEnter={(e) =>
                          ((e.target as HTMLSpanElement).style.color =
                            "#0056b3")
                        }
                        onMouseLeave={(e) =>
                          ((e.target as HTMLSpanElement).style.color =
                            "#1775bb")
                        }
                      >
                        {record?.solved_by_name}
                      </span>
                    </AntdTooltip>
                  ),
                },
                {
                  title: "Total",
                  dataIndex: "solved_ticket_count",
                  render: (text) => (
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#8dc73f",
                        fontSize: ".9em",
                      }}
                    >
                      {text}
                    </span>
                  ),
                },
              ]}
              dataSource={topSolver?.data?.length ? topSolver?.data : []}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Card>
        </Col>
        {/* Bar Chart */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card title="Last 12 Months Ticket Count">
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={ticketData} barGap={0}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="raiseTickets"
                    fill="#1775bb"
                    name="Raise Tickets"
                  />
                  <Bar
                    dataKey="solvedTickets"
                    fill="#8dc73f"
                    name="Solved Tickets"
                  />
                  <Bar
                    dataKey="unsolvedTickets"
                    fill="#ff4d4f"
                    name="Unsolved Tickets"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Last 30 Days */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card title="Last 30 Days" style={{ height: "100%" }}>
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
