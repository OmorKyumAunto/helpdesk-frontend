import {
  FilterOutlined,
  ClearOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Row,
  Select,
  Card,
  Space,
  Button,
  Statistic,
  Badge,
  Typography,
  Tag,
} from "antd";
import { useState, useEffect, useMemo } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetTaskReportQuery } from "../api/reportsEndPoints";
import dayjs from "dayjs";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import Lottie from "lottie-react";
import blueLoader from "../../../assets/blueloader.json";
import TaskReportPDFDownload from "./TaskReportPDFDownload";

const { Text } = Typography;

const TaskReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [listIds, setListIds] = useState<number[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    setFilter({});
    setListIds([]);
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const { data: categoryData, isLoading: categoryLoading } =
    useGetTaskCategoryQuery();

  const unitOption = useMemo(() => {
    const unitOptionForAdmin = unitData?.data?.filter((unit: any) =>
      profile?.data?.searchAccess?.some(
        (item: any) => item?.unit_id === unit?.id
      )
    );

    return profile?.data?.role_id === 2 || profile?.data?.role_id === 4
      ? unitOptionForAdmin
      : unitData?.data;
  }, [unitData?.data, profile?.data?.searchAccess, profile?.data?.role_id]);

  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit_id || 0,
    { skip: !filter.unit_id }
  );

  const { data, isLoading, isFetching } = useGetTaskReportQuery({
    ...filter,
    category: listIds,
  });

  const clearAllFilters = () => {
    setFilter({});
    setListIds([]);
  };

  const activeFilterCount =
    Object.keys(filter).filter(
      (key) =>
        filter[key] !== undefined &&
        filter[key] !== null &&
        filter[key] !== ""
    ).length + (listIds.length > 0 ? 1 : 0);

  const taskList = data?.data || [];

  const convertToMinutes = (value: number | string, format?: string) => {
    const num = Number(value || 0);
    if (format === "hours") return num * 60;
    return num;
  };

  const formatMinutesToText = (totalMinutes: number) => {
    if (!totalMinutes || totalMinutes <= 0) return "0 min";

    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} d`);
    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0) parts.push(`${minutes} min`);

    return parts.join(" ");
  };

  const getDateTime = (date?: string | null, time?: string | null) => {
    if (!date || !time) return null;
    const datePart = dayjs(date).format("YYYY-MM-DD");
    return dayjs(`${datePart} ${time}`, "YYYY-MM-DD HH:mm:ss");
  };

  const getTaskRequiredMinutes = (task: any) => {
    const start = getDateTime(task.task_start_date, task.task_start_time);
    const end = getDateTime(task.task_end_date, task.task_end_time);

    if (!start || !end || !start.isValid() || !end.isValid()) return 0;

    const diff = end.diff(start, "minute");
    return diff > 0 ? diff : 0;
  };

  const getTaskOverdueMinutes = (task: any) => {
    const start = getDateTime(task.task_start_date, task.task_start_time);
    const end = getDateTime(task.task_end_date, task.task_end_time);

    if (!start || !end || !start.isValid() || !end.isValid()) return null;

    const completedMinutes = end.diff(start, "minute");
    const slaMinutes = convertToMinutes(task.total_set_time, task.format);
    const overdueMinutes = completedMinutes - slaMinutes;

    return overdueMinutes > 0 ? overdueMinutes : 0;
  };

  const totalTasks = data?.count || data?.query_data?.total_count || 0;

  const completedTaskList = taskList.filter(
    (item: any) => item.task_status === "complete"
  );

  const completedTasks = completedTaskList.length;
  const inProgressTasks = taskList.filter(
    (item: any) => item.task_status === "inprogress"
  ).length;
  const incompleteTasks = taskList.filter(
    (item: any) => item.task_status === "incomplete"
  ).length;
  const overdueTasks = taskList.filter((item: any) => item.overdue === 1).length;
  const completedOnTimeTasks = completedTaskList.filter(
    (item: any) => item.overdue === 0
  ).length;

  const totalSLAMinutes = completedTaskList.reduce((sum: number, task: any) => {
    return sum + convertToMinutes(task.total_set_time, task.format);
  }, 0);

  const totalRequiredMinutes = completedTaskList.reduce(
    (sum: number, task: any) => {
      return sum + getTaskRequiredMinutes(task);
    },
    0
  );

  const totalSLABreakMinutes = Math.max(
    totalRequiredMinutes - totalSLAMinutes,
    0
  );

  const avgSLAMinutes =
    completedTasks > 0 ? Math.floor(totalSLAMinutes / completedTasks) : 0;

  const avgRequiredMinutes =
    completedTasks > 0 ? Math.floor(totalRequiredMinutes / completedTasks) : 0;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueRate =
    totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "#f5f5f5",
        }}
      >
        <Lottie
          animationData={blueLoader}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "clamp(8px, 2vw, 16px)",
        background: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Card
        bordered={false}
        size="small"
        style={{
          marginBottom: 12,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={24} md={16} lg={17} xl={18}>
            <Row gutter={[12, 12]}>
              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Total Tasks
                    </span>
                  }
                  value={totalTasks}
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#1890ff",
                  }}
                />
              </Col>

              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Completed
                    </span>
                  }
                  value={completedTasks}
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#52c41a",
                  }}
                />
              </Col>

              <Col xs={8}>
                <Statistic
                  title={
                    <span
                      style={{
                        fontSize: "clamp(10px, 1.5vw, 12px)",
                        color: "#666",
                      }}
                    >
                      Completion Rate
                    </span>
                  }
                  value={completionRate}
                  suffix="%"
                  valueStyle={{
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontWeight: 600,
                    color: "#722ed1",
                  }}
                />
              </Col>
            </Row>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={8}
            lg={7}
            xl={6}
            style={{
              textAlign: typeof window !== "undefined" && window.innerWidth > 768 ? "right" : "center",
            }}
          >
            <Space
              wrap
              size={[8, 8]}
              style={{
                width: "100%",
                justifyContent:
                  typeof window !== "undefined" && window.innerWidth > 768
                    ? "flex-end"
                    : "center",
              }}
            >
              <ExcelDownload
                isLoading={isLoading || isFetching}
                excelName={"Task Report"}
                excelTableHead={[
                  "Category Title",
                  "Description",
                  "Set Time",
                  "Total Set Time",
                  "Format",
                  "Start Date",
                  "Start Time",
                  "Task Code",
                  "Task Status",
                  "Task Start Date",
                  "Task End Date",
                  "Task Start Time",
                  "Task End Time",
                  "Quantity",
                  "User Name",
                  "User Employee ID",
                  "Created At",
                  "Overdue",
                  "Overdue Time",
                ]}
                excelData={
                  taskList.length
                    ? taskList.map(
                        ({
                          category_title,
                          description,
                          set_time,
                          total_set_time,
                          format,
                          start_date,
                          start_time,
                          task_code,
                          task_status,
                          task_start_date,
                          task_end_date,
                          task_start_time,
                          task_end_time,
                          quantity,
                          user_name,
                          user_employee_id,
                          created_at,
                          overdue,
                          ...rest
                        }: any) => {
                          const task = {
                            category_title,
                            description,
                            set_time,
                            total_set_time,
                            format,
                            start_date,
                            start_time,
                            task_code,
                            task_status,
                            task_start_date,
                            task_end_date,
                            task_start_time,
                            task_end_time,
                            quantity,
                            user_name,
                            user_employee_id,
                            created_at,
                            overdue,
                            ...rest,
                          };

                          const overdueMinutes = getTaskOverdueMinutes(task);

                          return {
                            "Category Title": category_title,
                            Description: description,
                            "Set Time": set_time,
                            "Total Set Time": total_set_time,
                            Format: format,
                            "Start Date": start_date
                              ? dayjs(start_date).format("DD-MM-YYYY")
                              : "N/A",
                            "Start Time": start_time,
                            "Task Code": task_code,
                            "Task Status": task_status,
                            "Task Start Date": task_start_date
                              ? dayjs(task_start_date).format("DD-MM-YYYY")
                              : "N/A",
                            "Task End Date": task_end_date
                              ? dayjs(task_end_date).format("DD-MM-YYYY")
                              : "N/A",
                            "Task Start Time": task_start_time,
                            "Task End Time": task_end_time,
                            Quantity: quantity,
                            "User Name": user_name,
                            "User Employee ID": user_employee_id,
                            "Created At": created_at,
                            Overdue: overdue === 1 ? "Yes" : "No",
                            "Overdue Time":
                              overdue === 1 && overdueMinutes !== null
                                ? formatMinutesToText(overdueMinutes)
                                : "N/A",
                          };
                        }
                      )
                    : []
                }
              />

              <TaskReportPDFDownload
                PDFFileName="task_report_query_data"
                fileHeader="Task Report"
                queryData={data?.query_data}
                taskList={taskList}
                PDFHeader={[
                  "Start Date",
                  "End Date",
                  "User Name",
                  "Task Status",
                  "Unit Name",
                  "Overdue",
                  "Total Count",
                ]}
                PDFData={{
                  "Start Date": data?.query_data?.start_date
                    ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "End Date": data?.query_data?.end_date
                    ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                    : "Not Applied",
                  "User Name":
                    data?.query_data?.employee_name ||
                    data?.query_data?.user_name ||
                    "All",
                  "Task Status": data?.query_data?.task_status || "All",
                  "Unit Name": data?.query_data?.unit_name || "All",
                  Overdue:
                    data?.query_data?.overdue === "1"
                      ? "Yes"
                      : data?.query_data?.overdue === "0"
                      ? "No"
                      : "All",
                  "Total Count": totalTasks,
                }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Status Cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #ff4d4f",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Overdue Tasks
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#ff4d4f",
                  lineHeight: 1.2,
                }}
              >
                {overdueTasks}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #faad14",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                In Progress
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#faad14",
                  lineHeight: 1.2,
                }}
              >
                {inProgressTasks}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #1890ff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Incomplete
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#1890ff",
                  lineHeight: 1.2,
                }}
              >
                {incompleteTasks}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Card
            size="small"
            bordered={false}
            style={{
              borderRadius: 6,
              borderLeft: "3px solid #52c41a",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              height: "100%",
            }}
            bodyStyle={{ padding: "clamp(10px, 2vw, 12px)" }}
          >
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "clamp(10px, 1.5vw, 11px)",
                  lineHeight: 1.3,
                }}
              >
                Completed On Time
              </Text>
              <Text
                strong
                style={{
                  fontSize: "clamp(16px, 3vw, 20px)",
                  color: "#52c41a",
                  lineHeight: 1.2,
                }}
              >
                {completedOnTimeTasks}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Card
        size="small"
        bordered={false}
        title={
          <Space size="small">
            <BarChartOutlined style={{ fontSize: 14 }} />
            <span
              style={{
                fontSize: "clamp(12px, 2vw, 14px)",
                fontWeight: 600,
              }}
            >
              Performance Metrics
            </span>
          </Space>
        }
        style={{
          marginBottom: 12,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
      >
        <Row gutter={[12, 12]}>
          {[
            {
              title: "Total SLA Time",
              value: formatMinutesToText(totalSLAMinutes),
            },
            {
              title: "Required Total Time",
              value: formatMinutesToText(totalRequiredMinutes),
            },
            {
              title: "SLA Break Time",
              value: formatMinutesToText(totalSLABreakMinutes),
            },
            {
              title: "Avg SLA Per Task",
              value: formatMinutesToText(avgSLAMinutes),
            },
            {
              title: "Avg Required Time",
              value: formatMinutesToText(avgRequiredMinutes),
            },
            {
              title: "Overdue Rate",
              value: `${overdueRate}%`,
            },
          ].map((item, idx) => (
            <Col xs={12} sm={8} md={8} lg={8} xl={8} key={idx}>
              <div
                style={{
                  background: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: 4,
                  padding: "clamp(8px, 2vw, 12px)",
                  textAlign: "center",
                  minHeight: 72,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  wordBreak: "break-word",
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: "clamp(9px, 1.5vw, 11px)",
                    display: "block",
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 14px)",
                    color: "#262626",
                    lineHeight: 1.3,
                  }}
                >
                  {item.value}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Filters */}
      <Card
        size="small"
        title={
          <Space size="small">
            <FilterOutlined style={{ fontSize: 14 }} />
            <span
              style={{
                fontSize: "clamp(12px, 2vw, 14px)",
                fontWeight: 600,
              }}
            >
              Filters
            </span>
            {activeFilterCount > 0 && (
              <Badge
                count={activeFilterCount}
                style={{ backgroundColor: "#1890ff" }}
              />
            )}
          </Space>
        }
        bordered={false}
        extra={
          <Space size={4} wrap>
            {activeFilterCount > 0 && (
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
                danger
                style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}
              >
                <span
                  style={{
                    display:
                      typeof window !== "undefined" && window.innerWidth > 480
                        ? "inline"
                        : "none",
                  }}
                >
                  Clear
                </span>
              </Button>
            )}
            <Button
              type="text"
              size="small"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              style={{ fontSize: "clamp(11px, 1.5vw, 12px)" }}
            >
              {isFilterExpanded ? "Hide" : "Show"}
            </Button>
          </Space>
        }
        style={{
          marginBottom: 12,
          borderRadius: 6,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: isFilterExpanded ? "clamp(12px, 2vw, 16px)" : 0,
          display: isFilterExpanded ? "block" : "none",
        }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Unit Name
              </Text>
              <Select
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit"
                showSearch
                optionFilterProp="children"
                onChange={(e) => {
                  setFilter({ ...filter, unit_id: e, user_id: undefined });
                }}
                options={unitOption?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                allowClear
                value={filter.unit_id}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Admin
                {filter.unit_id && (
                  <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>
                )}
              </Text>
              <Select
                loading={adminLoading}
                placeholder={
                  filter.unit_id ? "Select Admin (Required)" : "Select Admin"
                }
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={allAdmin?.data?.user_list?.map((item: UserList) => ({
                  value: item.user_id,
                  label: `[${item.employee_id}] ${item.name}`,
                }))}
                onChange={(e) => setFilter({ ...filter, user_id: e })}
                allowClear={!filter.unit_id}
                style={{ width: "100%" }}
                status={filter.unit_id && !filter.user_id ? "error" : undefined}
                value={filter.user_id}
                disabled={!filter.unit_id}
              />
              {filter.unit_id && !filter.user_id && (
                <Text
                  type="danger"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Please select an admin
                </Text>
              )}
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Category
              </Text>
              <Select
                style={{ width: "100%" }}
                mode="multiple"
                loading={categoryLoading}
                placeholder="Select Category"
                showSearch
                optionFilterProp="children"
                onChange={(e) => setListIds(e)}
                options={categoryData?.data?.map((item: any) => ({
                  value: item.id,
                  label: item.title,
                }))}
                allowClear
                value={listIds}
                maxTagCount="responsive"
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Task Status
              </Text>
              <Select
                allowClear
                placeholder="Select Status"
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, task_status: e })}
                options={[
                  { label: "Incomplete", value: "incomplete" },
                  { label: "Complete", value: "complete" },
                  { label: "In Progress", value: "inprogress" },
                ]}
                value={filter.task_status}
              />
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Overdue
              </Text>
              <Select
                allowClear
                placeholder="Select Overdue"
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, overdue: e })}
                options={[
                  { label: "All", value: "" },
                  { label: "Yes", value: "1" },
                  { label: "No", value: "0" },
                ]}
                value={filter.overdue}
              />
            </Space>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Space direction="vertical" size={2} style={{ width: "100%" }}>
              <Text
                style={{
                  fontSize: "clamp(11px, 1.5vw, 12px)",
                  fontWeight: 500,
                  color: "#595959",
                }}
              >
                Date Range
              </Text>
              <DatePicker.RangePicker
                presets={rangePreset}
                style={{ width: "100%" }}
                placeholder={["Start Date", "End Date"]}
                onChange={(_, e) =>
                  setFilter({
                    ...filter,
                    start_date: e[0],
                    end_date: e[1],
                  })
                }
                value={
                  filter.start_date && filter.end_date
                    ? [dayjs(filter.start_date), dayjs(filter.end_date)]
                    : undefined
                }
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Card
          size="small"
          bordered={false}
          style={{
            marginBottom: 12,
            background: "#e6f7ff",
            borderLeft: "3px solid #1890ff",
            borderRadius: 6,
          }}
          bodyStyle={{ padding: "clamp(8px, 2vw, 10px)" }}
        >
          <Space wrap size={[8, 4]}>
            <Text
              strong
              style={{
                fontSize: "clamp(11px, 1.5vw, 12px)",
                color: "#0050b3",
              }}
            >
              Active:
            </Text>

            {filter.unit_id && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Unit
              </Tag>
            )}

            {filter.user_id && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Admin
              </Tag>
            )}

            {listIds.length > 0 && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Category
              </Tag>
            )}

            {filter.task_status && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Task Status
              </Tag>
            )}

            {filter.overdue !== undefined && filter.overdue !== "" && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Overdue
              </Tag>
            )}

            {filter.start_date && (
              <Tag
                color="blue"
                style={{ fontSize: "clamp(10px, 1.5vw, 11px)", margin: 0 }}
              >
                Date Range
              </Tag>
            )}
          </Space>
        </Card>
      )}

      {/* Report Info Footer */}
      {data?.query_data && (
        <Card
          size="small"
          bordered={false}
          style={{
            borderRadius: 6,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
          bodyStyle={{ padding: "clamp(12px, 2vw, 16px)" }}
        >
          <Row gutter={[12, 8]}>
            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Report For
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 13px)",
                    wordBreak: "break-word",
                  }}
                >
                  {data.query_data.unit_name || "N/A"}
                </Text>
              </Space>
            </Col>

            <Col xs={24} sm={8}>
              <Space direction="vertical" size={2}>
                <Text
                  type="secondary"
                  style={{ fontSize: "clamp(10px, 1.5vw, 11px)" }}
                >
                  Employee
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: "clamp(12px, 2vw, 13px)",
                    wordBreak: "break-word",
                  }}
                >
                  {data.query_data.employee_name
                    ? `${data.query_data.employee_name} (${
                        data.query_data.employee_id || ""
                      })`
                    : "N/A"}
                </Text>
              </Space>
            </Col>

          </Row>
        </Card>
      )}
    </div>
  );
};

export default TaskReportModal;