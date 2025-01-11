import { Card, Col, Grid, Progress, Row, Space, Table, Typography } from "antd";
import { Tooltip as AntdTooltip } from "antd";
import { FaSquarePollVertical } from "react-icons/fa6";
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
  roleID: number;
}

const TicketDashboard = ({
  setActiveKey,
  roleID,
  setTicketValue,
  setTicketPriorityValue,
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
    },
    {
      id: 2,
      title: "Solved",
      value: "solved",
      data: data?.data?.total_solve,
    },
    {
      id: 3,
      title: "In Progress",
      value: "inprogress",
      data: data?.data?.total_inprogress,
    },
    {
      id: 4,
      title: "Unsolved",
      value: "unsolved",
      data: data?.data?.total_unsolved,
    },
    {
      id: 5,
      title: "Forward",
      value: "forward",
      data: data?.data?.total_forward,
    },
  ];
  const ticketData = barData?.data || [];

  return (
    <Card style={{ width: "100%", backgroundColor: "#f5f5f5" }}>
      <Row gutter={[12, 12]}>
        {ticketPriorityCards?.map((item) => (
          <Col
            key={item.id}
            style={{ width: lg ? "20%" : md ? "50%" : "100%" }}
          >
            <Card
              className="bg-[#ba45ba] text-white card-hover-stat"
              onClick={() => {
                setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                setTicketValue && setTicketValue(item.value);
              }}
              style={{
                textAlign: "center",
                backgroundColor: "#0d3c6e",
                color: "white",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              <div>
                <FaSquarePollVertical size={28} />
              </div>
              <h3>{item.title}</h3>
              <h1>{item.data}</h1>
            </Card>

            <style>
              {`
    .card-hover-stat {
      position: relative;
      overflow: hidden;
      border-radius: 15px; /* Rounded corners */
      transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth zoom-in/out and background transition */
    }

    .card-hover-stat:hover {
      transform: scale(1.05);  /* Zoom-in effect on hover */
      background-color: #9f33a0;  /* Subtle background color change */
    }

    .card-hover-stat::before {
      content: "";
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1); /* Subtle inner border */
      border-radius: 15px; /* Matching rounded corners */
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;  /* Prevent interaction with inner border */
    }

    .card-hover-stat:hover::before {
      opacity: 0;  /* Fade in the inner border on hover */
    }

    .card-hover-stat h3 {
      font-size: 18px;  /* Smaller title font */
    }

    .card-hover-stat h1 {
      font-size: 24px;  /* Adjusted font size */
      font-weight: bold;
      margin-top: 4px;
    }
  `}
            </style>
          </Col>
        ))}

        {/* Bar Chart */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card title="Last 12 Months Ticket Count">
            <div style={{ height: 250 }}>
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
                    name="Solved Tickets"
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Last 30 Days */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card title="Last 30 Days" style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Typography.Title level={5} style={{ margin: "0px" }}>
                  Raise Tickets
                </Typography.Title>
                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_ticket || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
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
                <Typography.Title level={5} style={{ margin: "0px" }}>
                  Solved Tickets
                </Typography.Title>
                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_solved || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
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
                <Typography.Title level={5} style={{ margin: "0px" }}>
                  Unsolved Tickets
                </Typography.Title>
                <Space
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {raiseSolved?.data?.total_unsolved || 0}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
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
                width: "100%",
                gap: "8px", // Reduced gap between cards
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
                    padding: "12px",
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
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginRight: "12px",
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
              height: "100%",
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
              height: "100%",
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
                          <p><strong>Name:</strong> {record?.solved_by_name}</p>
                          <p><strong>ID:</strong> {record?.employee_id}</p>
                          <p><strong>Email:</strong> {record?.email}</p>
                          <p><strong>Phone No:</strong> {record?.contact_no}</p>
                          <p><strong>Unit:</strong> {record?.unit_name}</p>
                          <p><strong>Total Solved Tickets:</strong> {record?.solved_ticket_count}</p>
                        </div>
                      }
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          cursor: "pointer",
                          color: "#1775bb",
                          transition: "color 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target as HTMLSpanElement).style.color = "#0056b3"}
                        onMouseLeave={(e) => (e.target as HTMLSpanElement).style.color = "#1775bb"}
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
                        fontSize: "1.1em",
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
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Card>
        </Col>


      </Row>
      {/* <ServiceDashboard /> */}
    </Card>
  );
};

export default TicketDashboard;
