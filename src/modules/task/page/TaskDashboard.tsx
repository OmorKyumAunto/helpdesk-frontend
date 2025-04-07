import {
  ClockCircleOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import {
  Tooltip as AntTooltip,
  Badge,
  Button,
  CalendarProps,
  Card,
  Col,
  Flex,
  List,
  Row,
  Table,
  Tag,
  Timeline,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  ListChecks,
  Clock,
  XCircle,
  CheckCircle,
  Timer,
  AlertTriangle,
} from "lucide-react";

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
import { useGetMeQuery } from "../../../app/api/userApi";
import SingleTask from "./SingleTask";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
const { Title, Text } = Typography;
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
interface TaskDashboardProps {
  setTaskStatus: (key: string) => void;
  setActiveKey: (key: string) => void;
}
const TaskDashboard = ({ setTaskStatus, setActiveKey }: TaskDashboardProps) => {
  const { data: profile } = useGetMeQuery();
  const dispatch = useDispatch();
  const roleID = profile?.data?.role_id;
  const { data: countData } = useGetDashboardTaskDataCountQuery();
  const { data: todayTask } = useGetDashboardTodayTaskQuery();
  const {
    avg_task_completion_time_seconds,
    total_task,
    total_task_complete,
    total_task_incomplete,
    total_task_inprogress,
    total_overdue_tasks,
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
                <Button
                  className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm transition-all duration-300 ease-in-out hover:bg-blue-600"
                  onClick={() => {
                    setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                  }}
                >
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
            <div
              className="bg-purple-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-purple-400/50 cursor-pointer"
              onClick={() => {
                setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
              }}
            >
              <div className="flex items-center gap-2">
                <ListChecks size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">{total_task || 0}</h2>
                  <p className="text-xs">Total Tasks</p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div
              className="bg-teal-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-teal-400/50 cursor-pointer"
              onClick={() => {
                setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                setTaskStatus && setTaskStatus("inprogress");
              }}
            >
              <div className="flex items-center gap-2">
                <Clock size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {total_task_inprogress || 0}
                  </h2>
                  <p className="text-xs">In Progress</p>
                </div>
              </div>
            </div>

            {/* Incomplete */}
            <div
              className="bg-red-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-400/50 cursor-pointer"
              onClick={() => {
                setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                setTaskStatus && setTaskStatus("incomplete");
              }}
            >
              <div className="flex items-center gap-2">
                <XCircle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {total_task_incomplete || 0}
                  </h2>
                  <p className="text-xs">Incomplete</p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div
              className="bg-sky-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-sky-400/50 cursor-pointer"
              onClick={() => {
                setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
                setTaskStatus && setTaskStatus("complete");
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {total_task_complete || 0}
                  </h2>
                  <p className="text-xs">Completed</p>
                </div>
              </div>
            </div>

            {/* Overdue */}
            <div
              className="bg-orange-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-orange-400/50 cursor-pointer"
              // onClick={() => {
              //   setActiveKey && setActiveKey(roleID === 1 ? "2" : "5");
              //   setTaskStatus && setTaskStatus("overdue");
              // }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {total_overdue_tasks || 0}
                  </h2>

                  <p className="text-xs">Overdue</p>
                </div>
              </div>
            </div>

            {/* Avg. Time */}
            <div className="bg-green-500 text-white rounded-full h-16 flex justify-center items-center shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-green-400/50">
              <div className="flex items-center gap-2">
                <Timer size={24} />
                <div className="text-center">
                  <h2 className="text-lg font-bold">
                    {secondsToHHMM(avg_task_completion_time_seconds || 0)}
                  </h2>
                  <p className="text-xs">Avg. Time</p>
                </div>
              </div>
            </div>
          </div>

          <Row gutter={[12, 12]} className="mb-6">
            <Col xs={24} sm={24} md={24} lg={8} style={{ padding: "0 1px" }}>
              <Card title="Today's Tasks" style={{ width: "100%" }}>
                <div
                  style={{
                    maxHeight: "366px",
                    overflowY: "hidden",
                    overflowX: "hidden",
                    transition: "overflow 0.3s ease-in-out",
                    padding: "0 4px", // Prevents hover clipping
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.overflowY = "auto")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.overflowY = "hidden")
                  }
                >
                  {todayTask?.data?.length ? (
                    <List
                      itemLayout="vertical"
                      dataSource={todayTask.data}
                      renderItem={(task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            dispatch(
                              setCommonModal({
                                content: <SingleTask id={task.id} />,
                                title: "Task Details",
                                show: true,
                              })
                            );
                          }}
                          style={{ overflow: "visible", padding: "0 4px" }}
                        >
                          <Badge.Ribbon
                            text={
                              task.task_status === "complete"
                                ? "Complete"
                                : task.task_status === "incomplete"
                                ? "Incomplete"
                                : "Inprogress"
                            }
                            color={
                              task.task_status === "complete"
                                ? "green"
                                : task.task_status === "incomplete"
                                ? "red"
                                : "blue"
                            }
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "-8px",
                              fontSize: "12px",
                              fontWeight: "500",
                              padding: "5px 12px",
                              zIndex: 10,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  task.task_status === "complete"
                                    ? "#e6ffe6"
                                    : task.task_status === "incomplete"
                                    ? "#ffe6e6"
                                    : "#e6e6ff",
                                padding: "10px",
                                borderRadius: "5px",
                                marginBottom: "6px",
                                border: "1px solid #d1d1d1",
                                transition:
                                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                willChange: "transform",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer",
                                transformOrigin: "center",
                                overflow: "visible",
                                minWidth: "0",
                                width: "100%",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.01)";
                                e.currentTarget.style.boxShadow =
                                  "0px 3px 6px rgba(0, 0, 0, 0.12)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow =
                                  "0px 1px 3px rgba(0, 0, 0, 0.1)";
                              }}
                            >
                              <p style={{ margin: 0, fontSize: "13px" }}>
                                ID: #{task.task_code}
                              </p>
                              <p style={{ fontSize: "13px", margin: 0 }}>
                                {task.category_title}
                              </p>
                              {roleID === 2 ? (
                                <Text
                                  type="secondary"
                                  style={{
                                    fontSize: "11px",
                                    color: "#555",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <ClockCircleOutlined
                                    style={{
                                      marginRight: "4px",
                                      fontSize: "11px",
                                    }}
                                  />
                                  {dayjs(
                                    dayjs().format("YYYY-MM-DD") +
                                      "T" +
                                      task.start_time
                                  ).format("hh:mm A")}
                                </Text>
                              ) : (
                                <p style={{ fontSize: "11px" }}>
                                  {`${task.user_name} (${task.user_employee_id})`}
                                </p>
                              )}
                            </div>
                          </Badge.Ribbon>
                        </div>
                      )}
                    />
                  ) : (
                    <Text type="secondary">No tasks for today.</Text>
                  )}
                </div>
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
