import React, { useState } from "react";
import {
  Card,
  Calendar,
  Progress,
  Badge,
  Table,
  Avatar,
  Button,
  Flex,
  CalendarProps,
  Tooltip as AntTooltip,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ClockCircleTwoTone,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const mockTasks = [
  {
    id: 1,
    name: "Dashboard Design",
    progress: 80,
    status: "In Progress",
    startDate: "12 Mar",
    dueDate: "20 Mar",
  },
  {
    id: 2,
    name: "App UI UX Design",
    progress: 40,
    status: "In Progress",
    startDate: "10 Mar",
    dueDate: "18 Mar",
  },
];
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TaskPercentagePie from "../components/TaskPercentagePie";
import { BadgeProps } from "antd/lib";
import TaskLineChart from "../components/LineChart";
import WorkingProgressPieChart from "../components/WorkingProgressPieChart";
import CompareBarChart from "../components/CompareBarChart";

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
    <div className="bg-gray-100 p-6 min-h-screen rounded-lg">
      {/* <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-500 text-sm">11 March 2025</p>
        </div>
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Search"
            className="mr-4 px-3 py-1 border rounded-md text-sm"
          />
          <div className="flex items-center bg-white px-2 py-1 rounded-md border">
            <CalendarOutlined className="mr-2 text-gray-500" />
            <span className="text-sm">11 March 2025</span>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Welcome and Stats */}
        <div className="lg:col-span-2">
          <Card className="mb-3">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-medium mb-1">Welcome To</h2>
                <h1 className="text-2xl font-bold text-blue-600 mb-2">
                  Your Task Management Area
                </h1>
                <p className="text-gray-500 text-sm mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Debitis maxime natus unde labore
                </p>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
                  Learn More
                </Button>
              </div>
              <img
                src="/api/placeholder/200/150"
                alt="Task management illustration"
                className="w-48"
              />
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
                  <p className="">Tasks</p>
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
                  <p className="text-sm">Critical</p>
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
                  <p className="text-sm">On Going</p>
                </div>
              </Flex>
            </div>
            <div className="bg-green-500 text-white rounded-full h-20 flex justify-center items-center">
              <Flex justify="center" gap={10} align="center">
                <div>
                  <ClockCircleOutlined style={{ fontSize: "28px" }} />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">1550</h2>
                  <p className="text-sm">Completed</p>
                </div>
              </Flex>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card title="Upcoming Task">
              <TaskLineChart />
            </Card>
            <Card title="Total work">
              <CompareBarChart />
            </Card>
          </div>
        </div>
        {/* Right Column - Calendar and Status */}
        <div className="lg:col-span-1">
          <Card className="mb-6" title="Task Percentage">
            <TaskPercentagePie />
          </Card>
          <Card className="mb-6" title="Working Progress">
            <WorkingProgressPieChart />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
