import {
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Input,
  Pagination,
  Popover,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { sanitizeFormValue } from "react-form-sanitization";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { rangePreset } from "../../../common/rangePreset";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import {
  useDeleteTaskMutation,
  useEndTaskMutation,
  useGetTaskItemsQuery,
  useStartedTaskMutation,
  useStartTaskMutation,
} from "../api/taskEndpoint";
import AssignTask from "../components/AssignTask";
import CountdownTask from "../components/CountdownTask";
import UpdateTask from "../components/UpdateTask";
import { ITaskParams } from "../types/taskTypes";
import SingleTask from "./SingleTask";

const TaskManager = ({
  roleID,
  taskStatus,
}: {
  roleID?: number;
  taskStatus: string;
}) => {
  const { data } = useGetTaskCategoryQuery();
  const listCategory = data?.data || [];
  const [removeTask] = useDeleteTaskMutation();
  const [starTask] = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask] = useEndTaskMutation();
  const [listIds, setListIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const dispatch = useDispatch();
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<ITaskParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter({
      ...filter,
      limit: Number(pageSize),
      offset: skipValue,
    });
  }, [page, pageSize, skipValue]);

  const sanitizeData = sanitizeFormValue(filter);

  const {
    data: taskItems,
    isLoading: taskLoader,
    isFetching,
  } = useGetTaskItemsQuery({
    ...sanitizeData,
    category: listIds,
  });

  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      task_status: taskStatus || prevFilter.task_status,
      offset: 0,
    }));
  }, [taskStatus]);
  return (
    <div>
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
                  prefix={<SearchOutlined />}
                  onChange={(e) =>
                    setFilter({ ...filter, key: e.target.value, offset: 0 })
                  }
                />
              </div>
              <Select
                allowClear
                placeholder="Select Status"
                style={{ width: "160px" }}
                onChange={(e) =>
                  setFilter({ ...filter, task_status: e, offset: 0 })
                }
                defaultValue={taskStatus || null}
                options={[
                  { label: "Incomplete", value: "incomplete" },
                  { label: "Complete", value: "complete" },
                  { label: "Inprogress", value: "inprogress" },
                  // {label:'Overdue',value:'overdue'},
                ]}
              />
              <div>
                <DatePicker.RangePicker
                  style={{ width: "250px" }}
                  presets={rangePreset}
                  onChange={(_, e) =>
                    setFilter({
                      ...filter,
                      start_date: e[0],
                      end_date: e[1],
                      offset: 0,
                    })
                  }
                />
              </div>

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
            </Space>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <Row gutter={[16, 16]} style={{ padding: 12 }}>
        {/* Main Task View */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={[14, 14]}>
            {taskItems?.data?.map((item) => (
              <Col key={item.id} xs={24} sm={24} md={12}>
                <Card
                  bordered={false}
                  loading={taskLoader || isFetching}
                  onClick={() => {
                    dispatch(
                      setCommonModal({
                        content: <SingleTask id={item.id} />,
                        title: "Task Details",
                        width: "72%",
                        show: true,
                      })
                    );
                  }}
                  style={{
                    backgroundColor: "#f7f9fc", // Light background for a modern look
                    borderRadius: "16px", // Softer rounded corners
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    transition:
                      "transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease", // Smooth transitions on hover
                    cursor: "pointer",
                    height: "100%",
                    position: "relative", // For absolute positioning of the badge
                  }}
                  className="sla-card"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  } // Hover effect: scale up
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  } // Reset hover effect
                >
                  {/* Status Badge - Positioned outside and slightly down */}
                  <Badge.Ribbon
                    text={
                      item.task_status === "complete"
                        ? "Complete"
                        : item.task_status === "incomplete"
                          ? "Incomplete"
                          : "In Progress"
                    }
                    color={
                      item.task_status === "complete"
                        ? "green"
                        : item.task_status === "incomplete"
                          ? "red"
                          : "blue"
                    }
                    style={{
                      position: "absolute",
                      top: "40px", // Slightly lower than the default
                      right: "-30px", // Move the badge slightly outside the card
                      fontSize: "12px", // Smaller font size for the badge
                      fontWeight: "600", // Bold text for better visibility
                      padding: "5px 12px", // More padding to enhance the badge shape
                      zIndex: 10, // Ensure badge floats above the content
                    }}
                  />

                  <div>
                    {/* Task ID and Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                          Task ID #{item.task_code}
                        </h1>
                      </div>
                      <Flex gap={4} justify="center" align="center">
                        <div>
                          {item.starred ? (
                            <FaStar
                              onClick={(e) => {
                                e.stopPropagation();
                                starTask({
                                  body: { starred: 0 },
                                  id: item.id,
                                });
                              }}
                              size={20}
                              color="gold"
                            />
                          ) : (
                            <FaRegStar
                              onClick={(e) => {
                                e.stopPropagation();
                                starTask({
                                  body: { starred: 1 },
                                  id: item.id,
                                });
                              }}
                              size={20}
                            />
                          )}
                        </div>

                        {/* Popover for Edit and Delete */}
                        {item.task_status === "incomplete" && (
                          <Popover
                            content={
                              <Space direction="vertical">
                                <Button
                                  size="small"
                                  type="primary"
                                  style={{ width: "60px" }}
                                  onClick={(e) => {
                                    dispatch(
                                      setCommonModal({
                                        title: "Update Task",
                                        content: <UpdateTask single={item} />,
                                        show: true,
                                      })
                                    );
                                    e.stopPropagation();
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  type="primary"
                                  danger
                                  style={{ width: "60px" }}
                                  onClick={(e) => {
                                    removeTask(item.id);
                                    e.stopPropagation();
                                  }}
                                >
                                  Delete
                                </Button>
                              </Space>
                            }
                            trigger="hover"
                          >
                            <Button type="text" icon={<EllipsisOutlined />} />
                          </Popover>
                        )}
                      </Flex>
                    </div>

                    {/* Task Category and Description */}
                    <div>
                      <div>
                        <span className="text-xl font-semibold text-indigo-700">
                          {item.category_title}{' '}
                          <span className="text-sm font-bold text-indigo-500">x{item.quantity}</span>
                        </span>
                      </div>
                    </div>


                    {/* Task Start Time */}
                    <div className="mt-2 flex items-center text-sm text-gray-600">
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
                      {item.task_start_time
                        ? `Starts In: ${dayjs(item.task_start_date).format(
                          "DD MMM YYYY"
                        )} ${item.task_start_time}`
                        : `Will Start In: ${dayjs(item.start_date).format(
                          "DD MMM YYYY"
                        )} ${item.start_time}`}
                    </div>

                    <Flex justify="space-between" align="center">
                      {/* Task Action Buttons */}
                      <div className="mt-3 flex gap-2">
                        {item.task_status === "incomplete" && (
                          <Button
                            type="primary"
                            onClick={(e) => {
                              startedTask(item.id);
                              e.stopPropagation();
                            }}
                            style={{
                              background:
                                "linear-gradient(135deg, #43a047, #66bb6a)",
                              border: "none",
                              borderRadius: "12px",
                              padding: "6px 26px",
                              fontSize: "13px",
                              fontWeight: "600",
                              transition: "all 0.2s ease-in-out",
                              boxShadow: "0 3px 8px rgba(76, 175, 80, 0.2)",
                            }}
                            className="hover:shadow-md hover:scale-105"
                          >
                            Start
                          </Button>
                        )}
                        {item.task_status === "inprogress" && (
                          <Button
                            danger
                            type="primary"
                            onClick={(e) => {
                              endedTask(item.id);
                              e.stopPropagation();
                            }}
                            style={{
                              background:
                                "linear-gradient(135deg, #e53935, #ef5350)",
                              border: "none",
                              borderRadius: "12px",
                              padding: "6px 26px",
                              fontSize: "13px",
                              fontWeight: "600",
                              transition: "all 0.2s ease-in-out",
                              boxShadow: "0 3px 8px rgba(244, 67, 54, 0.2)",
                            }}
                            className="hover:shadow-md hover:scale-105"
                          >
                            End
                          </Button>
                        )}
                      </div>
                      {/* Countdown */}
                      <div className="flex items-center gap-2 mt-3">
                        <CountdownTask item={item} />
                      </div>
                    </Flex>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {(taskItems?.count || 0) > 6 ? (
            <Pagination
              className="mt-8"
              size="small"
              align="end"
              pageSizeOptions={["10", "20", "30", "50", "100"]}
              current={page}
              pageSize={pageSize}
              total={taskItems?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange}
              showSizeChanger
            />
          ) : null}
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <div
            className="w-full h-full bg-white border-r border-gray-200 rounded-lg flex flex-col shadow-xl transition-all ease-in-out transform hover:scale-103 hover:shadow-2xl"
            style={{
              transition:
                "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.85)", // Slightly more opaque glassmorphism effect
              backdropFilter: "blur(10px)", // Enhanced frosted glass effect
              borderRadius: "20px", // Soft rounded corners for a high-end feel
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow for depth with more contrast
            }}
          >
            <div className="p-6">
              <Space direction="vertical" style={{ width: "100%" }}>
                {/* Starred Button with Gradient Hover Effect */}
                <Button
                  icon={
                    filter.starred === 1 ? (
                      <StarFilled style={{ color: "gold" }} />
                    ) : (
                      <StarOutlined />
                    )
                  }
                  className="w-full flex justify-start items-center gap-3 rounded-full text-gray-800 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all ease-in-out"
                  onClick={(e) =>
                    setFilter({
                      ...filter,
                      starred: filter.starred === 1 ? 0 : 1,
                      offset: 0,
                    })
                  }
                  style={{
                    padding: "14px 24px",
                    fontSize: "17px",
                    fontWeight: "600",
                    borderRadius: "50px",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)", // Slightly more intense shadow for button
                  }}
                >
                  Starred
                </Button>
              </Space>

              <div className="mt-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                  Lists
                </h2>

                {/* Checkbox Group with Modern Hover Effects and Shadow */}
                <Checkbox.Group
                  style={{ width: "100%" }}
                  options={
                    listCategory?.map((item) => {
                      return {
                        label: item.title,
                        value: item.id,
                      };
                    }) || []
                  }
                  onChange={(checkedValues: any) => {
                    setListIds(checkedValues);
                  }}
                >
                  {listCategory?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #e1e1e1", // Light border to maintain softness
                        padding: "16px 24px", // Rich padding for a premium layout
                        marginBottom: "16px", // Increased margin between checkbox items
                        width: "100%",
                        boxSizing: "border-box", // Ensures padding and border are included in width calculation
                        borderRadius: "14px", // Smooth rounded corners for checkboxes
                        background: "#f9f9f9", // Slightly lighter background for checkboxes
                        transition:
                          "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                        cursor: "pointer",
                      }}
                      className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:scale-105 hover:shadow-lg hover:transform hover:scale-102 transition-all ease-in-out"
                    >
                      <Checkbox
                        value={String(item.id)}
                        className="font-semibold text-gray-700"
                      >
                        {item.title}
                      </Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TaskManager;
