import {
  EllipsisOutlined,
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
  Flex,
  Input,
  Pagination,
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
import { useEffect, useState } from "react";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import { ITaskParams } from "../types/taskTypes";
import { sanitizeFormValue } from "react-form-sanitization";
import SingleTask from "./SingleTask";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useDispatch } from "react-redux";
import CountdownTask from "../components/CountdownTask";
import UpdateTask from "../components/UpdateTask";

const ListTaskOther = () => {
  const [othersValue, setOthersValue] = useState("others");
  const { data } = useGetTaskCategoryQuery();
  const dispatch = useDispatch();
  const listCategory = data?.data || [];
  const [removeTask] = useDeleteTaskMutation();
  const [starTask] = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask] = useEndTaskMutation();
  const [listIds, setListIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const handleSegment = (values: string) => {
    setOthersValue(values);
  };

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
    data: otherTaskListTo,
    isFetching: toFetching,
    isLoading: toLoading,
  } = useGetOtherTaskListQuery({
    assign_to: 1,
    category: listIds,
    ...sanitizeData,
  });
  const {
    data: otherTaskListOthers,
    isLoading,
    isFetching,
  } = useGetOtherTaskListQuery({
    assign_from_others: 1,
    category: listIds,
    ...sanitizeData,
  });
  const otherTaskList =
    othersValue === "to" ? otherTaskListTo : otherTaskListOthers;

  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };

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
                  onChange={(e) =>
                    setFilter({ ...filter, key: e.target.value, offset: 0 })
                  }
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
                  loading={isLoading || isFetching || toLoading || toFetching}
                  onClick={() => {
                    othersValue !== "to" &&
                      dispatch(
                        setCommonModal({
                          content: <SingleTask id={item.id} />,
                          title: "Task Details",
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
                    </div>

                    {/* Task Category and Description */}
                    <div>
                      <div>
                        <span className="text-xl font-semibold text-indigo-700">
                          {item.category_title}
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
                      {othersValue !== "to" && (
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
                      )}
                      {/* Countdown */}
                      <div className="flex items-center gap-2 mt-3">
                        {/* <CountdownTask item={item} /> */}
                      </div>
                    </Flex>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {(otherTaskList?.count || 0) > 6 ? (
            <Pagination
              className="mt-8"
              size="small"
              align="end"
              pageSizeOptions={["10", "20", "30", "50", "100"]}
              current={page}
              pageSize={pageSize}
              total={otherTaskList?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange}
              showSizeChanger
            />
          ) : null}
        </Col>

        {/* Right Sidebar */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <div className="w-full h-[84vh] bg-white border-r border-gray-200 rounded-lg flex flex-col">
            <div className="p-4">
              {/* <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  icon={
                    filter.starred === 1 ? (
                      <StarFilled style={{ color: "gold" }} />
                    ) : (
                      <StarOutlined />
                    )
                  }
                  className="w-full"
                  onClick={(e) =>
                    setFilter({
                      ...filter,
                      starred: filter.starred === 1 ? 0 : 1,
                      offset: 0,
                    })
                  }
                >
                  Starred
                </Button>
              </Space> */}

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
