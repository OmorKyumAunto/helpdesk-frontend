import { ClockCircleOutlined } from "@ant-design/icons";
import {
  Tooltip as AntTooltip,
  Badge,
  Button,
  CalendarProps,
  Card,
  Col,
  Flex,
  Row,
  Table,
} from "antd";
import { Dayjs } from "dayjs";

import { BadgeProps } from "antd/lib";
import Lottie from "lottie-react";
import Animation from "../../../../public/Animation - 1742751729342.json";
import CompareBarChart from "../components/CompareBarChart";
import TaskPercentagePie from "../components/TaskPercentagePie";
import WorkingProgressPieChart from "../components/WorkingProgressPieChart";
// Mock data for line chart
const chartData = [
  { name: "Jan", totalTasks: 400, completedTasks: 240 },
  { name: "Feb", totalTasks: 580, completedTasks: 350 },
  { name: "Mar", totalTasks: 700, completedTasks: 450 },
  { name: "Apr", totalTasks: 890, completedTasks: 520 },
  { name: "May", totalTasks: 1100, completedTasks: 700 },
  { name: "Jun", totalTasks: 950, completedTasks: 760 },
  { name: "Jul", totalTasks: 1200, completedTasks: 1000 },
];
const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};
const dateCellRender = (value: Dayjs) => {
  const listData = getListData(value);
  return (
    <ul className="events">
      {listData.map((item) => (
        <li key={item.content}>
          <AntTooltip title="hello">
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </AntTooltip>
        </li>
      ))}
    </ul>
  );
};

const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
  if (info.type === "date") return dateCellRender(current);
  return info.originNode;
};

const TaskDashboard = () => {
  return (
    <div className="min-h-screen rounded-lg">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card className="mb-3">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-medium mb-1">Welcome To</h2>
                <h1 className="text-2xl font-bold text-blue-600 mb-2">
                  Your Task Management Area
                </h1>
                <p className="text-gray-500 text-sm mb-4">
                  Great things are done by a series of small tasks brought
                  together.
                </p>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                  Go To Tasks
                </Button>
              </div>
              <div style={{ width: 140 }}>
                <Lottie animationData={Animation} loop={true} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-5 gap-4 mb-3">
            <div className="bg-purple-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">1220</h2>
                  <p className="">Total Tasks</p>
                </div>
              </Flex>
            </div>
            <div className="bg-teal-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">07</h2>
                  <p className="text-sm">In Progress</p>
                </div>
              </Flex>
            </div>
            <div className="bg-red-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">43</h2>
                  <p className="text-sm">In Complete</p>
                </div>
              </Flex>
            </div>
            <div className="bg-sky-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">452</h2>
                  <p className="text-sm">Completed</p>
                </div>
              </Flex>
            </div>
            <div className="bg-green-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">03:30</h2>
                  <p className="text-sm">Avg. Time</p>
                </div>
              </Flex>
            </div>
          </div>

          <Row gutter={[12, 12]} className="mb-6">
            <Col xs={24} sm={24} md={24} lg={8}>
              <Card title="Upcoming Task" style={{ height: "100%" }}>
                <Table
                  size="small"
                  pagination={false}
                  columns={[
                    {
                      key: "1",
                      dataIndex: "name",
                      title: "Task Title",
                    },
                    {
                      key: "2",
                      dataIndex: "date",
                      title: "Start Date & Time",
                    },
                  ]}
                  dataSource={[
                    {
                      id: 1,
                      name: "Test Task One",
                      date: "23 Mar 2025 11:30PM",
                    },
                    {
                      id: 2,
                      name: "Test Task Two",
                      date: "22 Mar 2025 9:30PM",
                    },
                    {
                      id: 2,
                      name: "Test Task Two",
                      date: "22 Mar 2025 9:30PM",
                    },
                    {
                      id: 2,
                      name: "Test Task Two",
                      date: "22 Mar 2025 9:30PM",
                    },
                    {
                      id: 2,
                      name: "Test Task Two",
                      date: "22 Mar 2025 9:30PM",
                    },
                  ]}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Card title="Total work">
                <CompareBarChart />
              </Card>
            </Col>
          </Row>
        </Col>
        {/* Right Column - Calendar and Status */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Card className="mb-6" title="Working Progress">
            <WorkingProgressPieChart />
          </Card>
          <Card className="mb-6" title="Task Percentage">
            <TaskPercentagePie />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskDashboard;
