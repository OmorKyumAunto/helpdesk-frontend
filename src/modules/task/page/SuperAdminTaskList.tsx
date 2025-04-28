import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Flex,
  Input,
  Pagination,
  Row,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { sanitizeFormValue } from "react-form-sanitization";
import { useDispatch } from "react-redux";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { rangePreset } from "../../../common/rangePreset";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetTaskItemsQuery } from "../api/taskEndpoint";
import CountdownTask from "../components/CountdownTask";
import { ITaskParams } from "../types/taskTypes";
import SingleTask from "./SingleTask";

const SuperAdminTaskList = ({ taskStatus }: { taskStatus: string }) => {
  const { data } = useGetTaskCategoryQuery();
  const listCategory = data?.data || [];
  const dispatch = useDispatch();
  const [listIds, setListIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<ITaskParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });
  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit_id || 0,
    { skip: !filter.unit_id }
  );

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
              <Dropdown
                trigger={["hover"]}
                dropdownRender={() => (
                  <div
                    style={{
                      padding: 16,
                      background: "#fff",
                      borderRadius: 8,
                      width: "160px",
                      border: "1px solid #f2f2f2",
                    }}
                  >
                    <Select
                      loading={unitIsLoading}
                      placeholder="Select Unit Name"
                      showSearch
                      optionFilterProp="children"
                      style={{ width: "180px" }}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={unitData?.data?.map((unit: any) => ({
                        value: unit.id,
                        label: unit.title,
                      }))}
                      onChange={(e) =>
                        setFilter({ ...filter, unit_id: e, offset: 0 })
                      }
                      allowClear
                    />
                    <Select
                      loading={adminLoading}
                      placeholder="Search Admin"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={allAdmin?.data?.user_list?.map(
                        (item: UserList) => ({
                          value: item.user_id,
                          label: `[${item.employee_id}] ${item.name}`,
                        })
                      )}
                      onChange={(e) =>
                        setFilter({ ...filter, user_id: e, offset: 0 })
                      }
                      allowClear
                      style={{ width: "180px" }}
                    />
                  </div>
                )}
              >
                <Button icon={<FilterOutlined />}>Filters</Button>
              </Dropdown>
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
                        content: (
                          <SingleTask
                            id={item.id}
                            user_name={item.user_name}
                            user_employee_id={item.user_employee_id}
                          />
                        ),
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
                      <span className="text-xl font-semibold text-indigo-700">
                        {item.category_title}
                      </span>
                      <p className="text-base font-semibold text-blue-700">
                        Owner: {`${item.user_name} (${item.user_employee_id})`}
                      </p>
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
          <div className="w-full h-[84vh] bg-white border-r border-gray-200 rounded-lg flex flex-col">
            <div className="p-4">
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

export default SuperAdminTaskList;
