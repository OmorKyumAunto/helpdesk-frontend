import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  OrderedListOutlined,
  PlusOutlined,
  SearchOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Input,
  Popover,
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { setCommonModal } from "../../../app/slice/modalSlice";
import TaskForm from "../components/TaskForm";
import { useDispatch } from "react-redux";
import ListForm from "../components/ListForm";
import AssignTask from "../components/AssignTask";
import {
  useDeleteTaskListMutation,
  useDeleteTaskMutation,
  useEndTaskMutation,
  useGetTaskItemsQuery,
  useGetTaskListQuery,
  useStartedTaskMutation,
  useStartTaskMutation,
} from "../api/taskEndpoint";
import ListFormUpdate from "../components/UpdateListForm";
import { useWatch } from "antd/es/form/Form";
import { FaRegStar, FaStar } from "react-icons/fa";
import dayjs from "dayjs";

const TaskManager = ({ roleID }: { roleID?: number }) => {
  const [starValue, setStarValue] = useState(false);
  const { data, isLoading } = useGetTaskListQuery();
  // const { data: taskItems, isLoading: taskLoader } = useGetTaskItemsQuery();
  // console.log(taskItems);
  const [remove] = useDeleteTaskListMutation();
  const [removeTask] = useDeleteTaskMutation();
  const [starTask] = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask] = useEndTaskMutation();
  const [activeList, setActiveList] = useState("My Tasks");
  const dispatch = useDispatch();
  const lists = data?.data || [];

  const [activeFilter, setActiveFilter] = useState<"" | "from" | "to">("from"); // Filter state
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 mins in seconds

  // Dummy data
  const taskItems = [
    {
      id: 1,
      task_code: "TASK001",
      title: "Sample Task Title 1",
      description: "This is a short task description example.",
      end_date: dayjs().add(2, "day").format("YYYY-MM-DD"),
      end_time: "05:00 PM",
      task_status: "incomplete",
    },
    {
      id: 2,
      task_code: "TASK002",
      title: "Sample Task Title 2",
      description: "Another task description for testing.",
      end_date: dayjs().add(1, "day").format("YYYY-MM-DD"),
      end_time: "03:00 PM",
      task_status: "inprogress",
    },
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto ">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Task Manager
              </h1>
            </div>
            <Space>
              <div>
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  // className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  prefix={<SearchOutlined />}
                />
              </div>
              {roleID === 2 ? (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    dispatch(
                      setCommonModal({
                        title: "Create Task",
                        content: <AssignTask />,
                        show: true,
                      })
                    );
                  }}
                >
                  Create Task
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    dispatch(
                      setCommonModal({
                        title: "Create Task",
                        content: <TaskForm />,
                        show: true,
                      })
                    );
                  }}
                >
                  Create Task
                </Button>
              )}
            </Space>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <Row gutter={[16, 16]} style={{ padding: 12 }}>
        {/* Main Task View */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={[14, 14]}>
            {taskItems?.map((item) => (
              <Col key={item.id} xs={24} sm={24} md={12}>
                <Card
                  bordered={false}
                  // loading={taskLoader}
                  style={{
                    backgroundColor: "#e6f0ff",
                    borderLeft: `5px solid #1890ff`,
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    transform: "scale(1)",
                    height: "100%",
                  }}
                  className="sla-card"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-base font-bold">
                          Task ID: {item.task_code}
                        </h1>
                      </div>
                      <Flex gap={4} justify="center" align="center">
                        <div>
                          {starValue ? (
                            <FaStar
                              onClick={() => {
                                starTask({
                                  body: { starred: starValue ? 1 : 0 },
                                  id: item.id,
                                }),
                                  setStarValue(!starValue);
                              }}
                              size={20}
                              color="gold"
                            />
                          ) : (
                            <FaRegStar
                              onClick={() => {
                                starTask({
                                  body: { starred: starValue ? 1 : 0 },
                                  id: item.id,
                                }),
                                  setStarValue(!starValue);
                              }}
                              size={20}
                            />
                          )}
                        </div>
                        <Popover
                          content={
                            <Space direction="vertical">
                              <Button
                                size="small"
                                type="primary"
                                style={{ width: "60px" }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                type="primary"
                                danger
                                style={{ width: "60px" }}
                                onClick={() => removeTask(item.id)}
                              >
                                Delete
                              </Button>
                            </Space>
                          }
                          trigger="hover"
                        >
                          <Button type="text" icon={<EllipsisOutlined />} />
                        </Popover>
                      </Flex>
                    </div>
                    <div>
                      <div>
                        <span className="text-xl  font-bold">{item.title}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="mb-3 mt-1 flex items-center text-base text-gray-700 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      End: {dayjs(item.end_date).format("DD MMM YYYY")}{" "}
                      {item.end_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {item.task_status}
                      </span>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined
                          style={{ fontSize: "16px", color: "#3f3f46" }}
                        />
                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg, #f0f0f0, #e4e4e7)",
                            color: "#333",
                            minWidth: "90px",
                            textAlign: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          }}
                        >
                          ⏳ {formatTime(timeLeft)}
                        </span>
                                  
                      </div>
                    </div>
                    {item.task_status === "incomplete" && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => startedTask(item.id)}
                        className="mt-3"
                      >
                        Start
                      </Button>
                    )}
                    {item.task_status === "inprogress" && (
                      <Button
                        size="small"
                        danger
                        type="primary"
                        onClick={() => endedTask(item.id)}
                        className="mt-3"
                      >
                        End
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <div className="w-full h-[84vh] bg-white border-r border-gray-200 rounded-lg flex flex-col">
            <div className="p-4">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button icon={<OrderedListOutlined />} className="w-full">
                  All Tasks
                </Button>

                <Button icon={<StarOutlined />} className="w-full">
                  Starred
                </Button>
              </Space>

              <div className="mt-5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Lists
                </h2>
                {lists.map((list, index) => (
                  <Button
                    key={list.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-1 ${
                      activeList === list.category_title
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveList(list.category_title)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-xs text-gray-500">
                        <Checkbox />
                      </span>
                      <span className="font-medium">{list.category_title}</span>
                    </div>
                    {/* <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {list.count}
                    </span> */}
                    <Popover
                      content={
                        <Space direction="vertical">
                          <Button
                            size="small"
                            type="primary"
                            style={{ width: "60px" }}
                            onClick={() => {
                              dispatch(
                                setCommonModal({
                                  title: "Update Task List",
                                  content: <ListFormUpdate singleData={list} />,
                                  show: true,
                                  width: "450px",
                                })
                              );
                            }}
                          >
                            Edit
                          </Button>
                          {lists?.length > 1 && (
                            <Button
                              size="small"
                              type="primary"
                              danger
                              style={{ width: "60px" }}
                              onClick={() => remove(list.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Space>
                      }
                      trigger="hover"
                    >
                      <Button
                        type="text"
                        size="small"
                        className=" text-gray-400 hover:text-gray-600"
                        icon={<EllipsisOutlined />}
                      />
                    </Popover>
                  </Button>
                ))}
                <Button
                  onClick={() => {
                    dispatch(
                      setCommonModal({
                        title: "Create New List",
                        content: <ListForm />,
                        show: true,
                        width: "450px",
                      })
                    );
                  }}
                  className="w-full flex items-center justify-center px-3 py-2 mt-4 text-gray-700 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create new list
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TaskManager;
