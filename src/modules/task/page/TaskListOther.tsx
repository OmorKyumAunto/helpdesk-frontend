import {
  EllipsisOutlined,
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
  Segmented,
  Space,
} from "antd";
import dayjs from "dayjs";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  useDeleteTaskMutation,
  useEndTaskMutation,
  useGetOtherTaskListQuery,
  useStartedTaskMutation,
  useStartTaskMutation,
} from "../api/taskEndpoint";
import { useState } from "react";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";

const ListTaskOther = () => {
  const [othersValue, setOthersValue] = useState("others");
  const { data, isLoading } = useGetTaskCategoryQuery();
  const listCategory = data?.data || [];
  const [removeTask] = useDeleteTaskMutation();
  const [starTask] = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask] = useEndTaskMutation();
  const [listIds, setListIds] = useState([]);
  const { data: otherTaskListTo } = useGetOtherTaskListQuery({
    assign_to: 1,
    category: listIds,
  });
  const { data: otherTaskListOthers } = useGetOtherTaskListQuery({
    assign_from_others: 1,
    category: listIds,
  });
  const otherTaskList =
    othersValue === "to" ? otherTaskListTo : otherTaskListOthers;

  const handleSegment = (values: string) => {
    setOthersValue(values);
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
              <Segmented<string>
                style={{ background: "#cccccc", fontWeight: "bold" }}
                options={[
                  { label: "Assign From Others", value: "others" },
                  { label: "Assign To", value: "to" },
                ]}
                onChange={handleSegment}
              />
              <div>
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  prefix={<SearchOutlined />}
                />
              </div>
            </Space>
          </div>
        </div>
      </header>

      {/* Main Content */}

      <Row gutter={[16, 16]} style={{ padding: 12 }}>
        {/* Main Task View */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={[14, 14]}>
            {otherTaskList?.data?.map((item) => (
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
                          {item.starred ? (
                            <FaStar
                              onClick={() => {
                                starTask({
                                  body: { starred: item.starred ? 1 : 0 },
                                  id: item.id,
                                });
                              }}
                              size={20}
                              color="gold"
                            />
                          ) : (
                            <FaRegStar
                              onClick={() => {
                                starTask({
                                  body: { starred: item.starred ? 1 : 0 },
                                  id: item.id,
                                });
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
                        <span className="text-xl  font-bold">
                          {item.category_title}
                        </span>
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
                      {/* <div className="flex items-center gap-2">
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
                                  
                      </div> */}
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
                <Button icon={<StarOutlined />} className="w-full">
                  Starred
                </Button>
              </Space>

              <div className="mt-5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Lists
                </h2>
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
                    // Corrected type here
                    setListIds(checkedValues);
                  }}
                >
                  {listCategory?.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #d9d9d9", // Add border
                        padding: "8px", // Add padding for spacing
                        marginBottom: "8px", // Add margin between checkboxes
                        width: "100%", // Ensure each checkbox takes full width
                        boxSizing: "border-box", // Include padding and border in width calculation
                      }}
                    >
                      <Checkbox value={String(item.id)}>{item.title}</Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
                {/* {listCategory.map((list) => (
                  <Button
                    key={list.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left mb-1 ${
                      activeList === list.title
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveList(list.title)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-xs text-gray-500">
                        <Checkbox />
                      </span>
                      <span className="font-medium">{list.title}</span>
                    </div>
                  </Button>
                ))} */}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ListTaskOther;
