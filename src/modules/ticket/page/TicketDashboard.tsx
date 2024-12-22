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
  useGetTicketDashboardCountQuery,
  useGetTopTicketSolverQuery,
} from "../api/ticketEndpoint";
const TicketDashboard = () => {
  const { md, lg } = Grid.useBreakpoint();
  const { data } = useGetTicketDashboardCountQuery();
  const { data: topSolver } = useGetTopTicketSolverQuery();
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
      title: "IN PROGRESS",
      data: data?.data?.total_inprocess,
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
  const ticketData = [
    { name: "Jan", raiseTickets: 100, solvedTickets: 80 },
    { name: "Feb", raiseTickets: 380, solvedTickets: 20 },
    { name: "Mar", raiseTickets: 50, solvedTickets: 30 },
    { name: "Apr", raiseTickets: 40, solvedTickets: 20 },
    { name: "May", raiseTickets: 280, solvedTickets: 250 },
    { name: "Jun", raiseTickets: 300, solvedTickets: 280 },
    { name: "Jul", raiseTickets: 150, solvedTickets: 100 },
    { name: "Aug", raiseTickets: 400, solvedTickets: 350 },
    { name: "Sep", raiseTickets: 250, solvedTickets: 200 },
    { name: "Oct", raiseTickets: 350, solvedTickets: 300 },
    { name: "Nov", raiseTickets: 750, solvedTickets: 400 },
    { name: "Dec", raiseTickets: 500, solvedTickets: 450 },
  ];

  return (
    <Card style={{ width: "100%", backgroundColor: "#f5f5f5" }}>
      <Row gutter={[12, 12]}>
        {ticketPriorityCards?.map((item) => (
          <Col
            key={item.id}
            style={{ width: lg ? "20%" : md ? "50%" : "100%" }}
          >
            <Card
              style={{
                textAlign: "center",
                backgroundColor: "#1775BB",
                color: "white",
              }}
            >
              <div>
                <FaSquarePollVertical size={28} />
              </div>
              <h3>{item.title}</h3>
              <h1>{item.data}</h1>
            </Card>
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
                    fill="#1890ff"
                    name="Raise Tickets"
                  />
                  <Bar
                    dataKey="solvedTickets"
                    fill="#ff4d4f"
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
                    6852
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    100%
                  </Typography.Text>
                </Space>
                <Progress percent={100} showInfo={false} status="normal" />
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
                    582
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      margin: "0px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    90%
                  </Typography.Text>
                </Space>
                <Progress
                  percent={90}
                  style={{ color: "green" }}
                  showInfo={false}
                  status="success"
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={7}>
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
        {/* Pie Chart Component */}
        <Col xs={24} sm={24} md={24} lg={10}>
          <Card title="Category Wise Percentage" style={{ height: "100%" }}>
            <PieChartWithLabels />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={7}>
          <Card title="Priority Base Counts" style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Card size="small">
                <Space>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      borderRadius: "50%",
                      background: "#ff4d4f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    12
                  </div>
                  <span style={{ fontWeight: "bold" }}>URGENT</span>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      borderRadius: "50%",
                      background: "#1890ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    40
                  </div>
                  <span style={{ fontWeight: "bold" }}>HIGH</span>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      borderRadius: "50%",
                      background: "#F9629F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    15
                  </div>
                  <span style={{ fontWeight: "bold" }}>MEDIUM</span>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      fontWeight: "bold",
                      borderRadius: "50%",
                      background: "#32de84",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    10
                  </div>
                  <span style={{ fontWeight: "bold" }}>LOW</span>
                </Space>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
      {/* <ServiceDashboard /> */}
    </Card>
  );
};

export default TicketDashboard;
