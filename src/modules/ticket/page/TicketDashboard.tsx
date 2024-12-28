import { Card, Col, Grid, Progress, Row, Space, Table, Typography } from "antd";
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
const TicketDashboard = () => {
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
      data: data?.data?.total_ticket,
    },
    {
      id: 2,
      title: "Solved",
      data: data?.data?.total_solve,
    },
    {
      id: 3,
      title: "In Progress",
      data: data?.data?.total_inprogress,
    },
    {
      id: 4,
      title: "Unsolved",
      data: data?.data?.total_unsolved,
    },
    {
      id: 5,
      title: "Forward",
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
              style={{
                textAlign: "center",
                backgroundColor: "#0d3c6e",
                color: "white",
                borderRadius: "15px", // Keep rounded corners as before
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
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
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
                style={{ fontWeight: "600", fontSize: "18px", color: "#333" }}
              >
                Priority Overview
              </span>
            }
            style={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            bodyStyle={{ padding: "15px" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {[
                {
                  label: "Urgent",
                  count: priority?.data?.priority_urgent || 0,
                  color: "#ff4d4f",
                },
                {
                  label: "High",
                  count: priority?.data?.priority_high || 0,
                  color: "#1890ff",
                },
                {
                  label: "Medium",
                  count: priority?.data?.priority_medium || 0,
                  color: "#faad14",
                },
                {
                  label: "Low",
                  count: priority?.data?.priority_low || 0,
                  color: "#52c41a",
                },
              ].map(({ label, count, color }) => (
                <Card
                  key={label}
                  style={{
                    borderRadius: "12px",
                    background: "#fff",
                    border: "1px solid #f0f0f0",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  hoverable
                  bodyStyle={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
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
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginRight: "16px",
                    }}
                  >
                    {count}
                  </div>
                  <div>
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      {label}
                    </span>
                    <br />
                    <span style={{ fontSize: "14px", color: "#666" }}>
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
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card title="Top Ticket Solvers" style={{ height: "100%" }}>
            <Table
              size="small"
              bordered
              pagination={false}
              columns={[
                {
                  title: "Name",
                  render: (record) => (
                    <>{`${record?.solved_by_name} (${record?.employee_id})`}</>
                  ),
                },
                {
                  key: "3",
                  title: "Total",
                  dataIndex: "solved_ticket_count",
                },
              ]}
              dataSource={topSolver?.data?.length ? topSolver?.data : []}
            />
          </Card>
        </Col>
      </Row>
      {/* <ServiceDashboard /> */}
    </Card>
  );
};

export default TicketDashboard;
