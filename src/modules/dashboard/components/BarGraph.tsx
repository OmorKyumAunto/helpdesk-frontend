import { Card, Col, Row } from "antd";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function BarGraph() {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 6000,
      amt: 2100,
    },
    {
      name: "Page H",
      uv: 3490,
      pv: 5000,
      amt: 2100,
    },
    {
      name: "Page I",
      uv: 3490,
      pv: 7000,
      amt: 2100,
    },
    {
      name: "Page K",
      uv: 3490,
      pv: 9000,
      amt: 2100,
    },
  ];
  function getMonthName(monthNumber: any) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1];
  }

  const agents = [
    { MONTH: 1, total_agent: 20 },
    { MONTH: 2, total_agent: 30 },
    { MONTH: 3, total_agent: 25 },
    { MONTH: 4, total_agent: 35 },
    { MONTH: 5, total_agent: 40 },
    { MONTH: 6, total_agent: 45 },
  ];
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9966",
  ];
  return (
    <>
      <Row gutter={[10, 10]}>
        <Col xs={24} lg={17}>
          <Card
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pv"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  dataKey="uv"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={7}>
          <Card
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  dataKey="total_agent"
                  data={agents}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8228d0"
                  label
                >
                  {agents.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      name={getMonthName(entry.MONTH)}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <PieChart />
          </Card>
        </Col>
      </Row>
    </>
  );
}
