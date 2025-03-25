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
import { ListChecks, Clock, XCircle, CheckCircle, Timer,AlertTriangle } from "lucide-react";

import { BadgeProps } from "antd/lib";
import Lottie from "lottie-react";
import Animation from "../../../../public/Animation - 1742751729342.json";
import CompareBarChart from "../components/CompareBarChart";
import TaskPercentagePie from "../components/TaskPercentagePie";
import WorkingProgressPieChart from "../components/WorkingProgressPieChart";
import {
  useGetDashboardTaskDataCountQuery,
  useGetDashboardTodayTaskQuery,
} from "../api/taskDashboardEndpoint";
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
  const { data: countData } = useGetDashboardTaskDataCountQuery();
  const { data: todayTask } = useGetDashboardTodayTaskQuery();
  const {
    avg_task_completion_time_seconds,
    total_task,
    total_task_complete,
    total_task_incomplete,
    total_task_inprogress,
  } = countData?.data || {};

  function secondsToHHMM(seconds: number) {
    if (typeof seconds !== "number" || seconds < 0) {
      return "Invalid input";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  return (
    <div className="min-h-screen rounded-lg">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={24} lg={18}>
          <Card
            className="mb-3 shadow-md transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg"
            style={{ height: "auto", padding: 0 }} // No padding and auto height for a compact design
          >
            <div className="flex flex-col md:flex-row items-center justify-between p-2">
              {/* Text Section */}
              <div className="text-center md:text-left">
                <h1 className="text-xl font-semibold text-blue-600 mb-2">
                  Welcome To Your Task Management Area
                </h1>
                <p className="text-gray-600 text-sm mb-3">
                  Great things are done by a series of small tasks brought
                  together.
                </p>
                <Button className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm transition-all duration-300 ease-in-out hover:bg-blue-600">
                  Go To Tasks
                </Button>
              </div>

              {/* Lottie Animation */}
              <div className="mt-0 md:mt-0" style={{ width: 120, height: 120 }}>
                <Lottie animationData={Animation} loop={true} />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            {/* Total Tasks */}
            <div className="bg-purple-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-purple-400/50">
              <div className="flex items-center gap-2">
                <ListChecks size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{total_task || 0}</h2>
                  <p className="text-xs">Total Tasks</p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-teal-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-teal-400/50">
              <div className="flex items-center gap-2">
                <Clock size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{total_task_inprogress || 0}</h2>
                  <p className="text-xs">In Progress</p>
                </div>
              </div>
            </div>

            {/* Incomplete */}
            <div className="bg-red-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-400/50">
              <div className="flex items-center gap-2">
                <XCircle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{total_task_incomplete || 0}</h2>
                  <p className="text-xs">Incomplete</p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-sky-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-sky-400/50">
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{total_task_complete || 0}</h2>
                  <p className="text-xs">Completed</p>
                </div>
              </div>
            </div>

            {/* Overdue */}
            <div className="bg-orange-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-orange-400/50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{0}</h2>
                  <p className="text-xs">Overdue</p>
                </div>
              </div>
            </div>

            {/* Avg. Time */}
            <div className="bg-green-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-green-400/50">
              <div className="flex items-center gap-2">
                <Timer size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{secondsToHHMM(avg_task_completion_time_seconds || 0)}</h2>
                  <p className="text-xs">Avg. Time</p>
                </div>
              </div>
            </div>
          </div>


          <Row gutter={[12, 12]} className="mb-6">
            <Col xs={24} sm={24} md={24} lg={8}>
              <Card title="Today Task" style={{ height: "100%" }}>
                <Table
                  size="small"
                  pagination={false}
                  rowKey={"id"}
                  columns={[
                    {
                      key: "1",
                      dataIndex: "category_title",
                      title: "Task Title",
                    },
                    {
                      key: "2",
                      dataIndex: "start_time",
                      title: "Start Time",
                    },
                    {
                      key: "3",
                      dataIndex: "description",
                      title: "Description",
                      width: "30%",
                    },
                  ]}
                  dataSource={todayTask?.data || []}
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
