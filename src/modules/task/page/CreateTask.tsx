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
import styled from "styled-components";
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

/* ── Header ─────────────────────────────────────────────────────── */
const HeaderWrapper = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
`;
const HeaderInner = styled.div`display:flex;flex-direction:column;gap:10px;`;
const BrandLeft = styled.div`
  display:flex;align-items:center;gap:10px;
  h1{margin:0;font-size:18px;font-weight:700;color:#111827;white-space:nowrap;}
`;
const FilterBar = styled.div`
  display:flex;flex-wrap:wrap;gap:8px;align-items:center;
  &>*{flex:1 1 140px;min-width:0;max-width:100%;}
  &>.create-btn{flex:0 0 auto;}
  @media(max-width:480px){
    &>*{flex:1 1 100%;}
    &>.create-btn{flex:1 1 100%;}
  }
`;
const SearchWrap = styled.div`.ant-input-affix-wrapper{width:100%;}`;
const DateWrap   = styled.div`.ant-picker{width:100%;}`;
const SelectWrap = styled.div`.ant-select{width:100%;}.ant-select-selector{width:100%!important;}`;

/* ── Sidebar ─────────────────────────────────────────────────────── */
const Sidebar = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const SidebarSection = styled.div`
  padding: 12px 14px;
  &:not(:last-child) { border-bottom: 1px solid #f0f0f0; }
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 10px;
`;

const StarBtn = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid ${({ active }) => (active ? "#fbbf24" : "#e5e7eb")};
  background: ${({ active }) => (active ? "#fffbeb" : "#fafafa")};
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
  &:hover { background: #fffbeb; border-color: #fbbf24; }
  span {
    font-size: 13px;
    font-weight: 600;
    color: ${({ active }) => (active ? "#92400e" : "#374151")};
  }
`;

/* Chip grid — 2 per row, wrapping */
const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.button<{ active: boolean }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${({ active }) => (active ? "#2563eb" : "#e2e8f0")};
  background: ${({ active }) => (active ? "#2563eb" : "#f8fafc")};
  color: ${({ active }) => (active ? "#fff" : "#475569")};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover {
    border-color: #2563eb;
    background: ${({ active }) => (active ? "#1d4ed8" : "#eff6ff")};
    color: ${({ active }) => (active ? "#fff" : "#1d4ed8")};
  }
`;

/* ── Component ─────────────────────────────────────────────────── */
const TaskManager = ({
  roleID,
  taskStatus,
}: {
  roleID?: number;
  taskStatus: string;
}) => {
  const { data } = useGetTaskCategoryQuery();
  const listCategory = data?.data || [];
  const [removeTask]  = useDeleteTaskMutation();
  const [starTask]    = useStartedTaskMutation();
  const [startedTask] = useStartTaskMutation();
  const [endedTask]   = useEndTaskMutation();
  const [listIds, setListIds] = useState<string[]>([]);
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const dispatch  = useDispatch();
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<ITaskParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter((p) => ({ ...p, limit: Number(pageSize), offset: skipValue }));
  }, [page, pageSize, skipValue]);

  const sanitizeData = sanitizeFormValue(filter);
  const { data: taskItems, isLoading: taskLoader, isFetching } =
    useGetTaskItemsQuery({ ...sanitizeData, category: listIds.map(Number) });

  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };

  useEffect(() => {
    setFilter((p) => ({ ...p, task_status: taskStatus || p.task_status, offset: 0 }));
  }, [taskStatus]);

  const toggleCat = (id: string) =>
    setListIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  return (
    <div>
      {/* ── Header ── */}
      <HeaderWrapper>
        <HeaderInner>
          <BrandLeft>
            <svg xmlns="http://www.w3.org/2000/svg"
              style={{ width: 26, height: 26, color: "#2563eb", flexShrink: 0 }}
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <h1>Task Manager</h1>
          </BrandLeft>

          <FilterBar>
            <SearchWrap>
              <Input placeholder="Search tasks..." prefix={<SearchOutlined />}
                onChange={(e) => setFilter({ ...filter, key: e.target.value, offset: 0 })} />
            </SearchWrap>
            <SelectWrap>
              <Select allowClear placeholder="Select Status" style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, task_status: e, offset: 0 })}
                defaultValue={taskStatus || null}
                options={[
                  { label: "Incomplete", value: "incomplete" },
                  { label: "Complete",   value: "complete"   },
                  { label: "Inprogress", value: "inprogress" },
                ]} />
            </SelectWrap>
            <DateWrap>
              <DatePicker.RangePicker style={{ width: "100%" }} presets={rangePreset}
                onChange={(_, e) => setFilter({ ...filter, start_date: e[0], end_date: e[1], offset: 0 })} />
            </DateWrap>
            <Button type="primary" icon={<PlusOutlined />} className="create-btn"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => dispatch(setCommonModal({ title: "Create Task", content: <AssignTask />, show: true }))}>
              Create Task
            </Button>
          </FilterBar>
        </HeaderInner>
      </HeaderWrapper>

      {/* ── Main ── */}
      <Row gutter={[16, 16]} style={{ padding: 12 }}>

        {/* Task cards */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={[14, 14]}>
            {taskItems?.data?.map((item) => (
              <Col key={item.id} xs={24} sm={24} md={12}>
                <Card bordered={false} loading={taskLoader || isFetching}
                  onClick={() => dispatch(setCommonModal({ content: <SingleTask id={item.id} />, title: "Task Details", width: "72%", show: true }))}
                  style={{ backgroundColor: "#f7f9fc", borderRadius: "16px", boxShadow: "0 12px 24px rgba(0,0,0,0.1)", transition: "transform 0.3s ease", cursor: "pointer", height: "100%", position: "relative" }}
                  className="sla-card"
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>

                  <Badge.Ribbon
                    text={item.task_status === "complete" ? "Complete" : item.task_status === "incomplete" ? "Incomplete" : "In Progress"}
                    color={item.task_status === "complete" ? "green" : item.task_status === "incomplete" ? "red" : "blue"}
                    style={{ position: "absolute", top: "40px", right: "-30px", fontSize: "12px", fontWeight: "600", zIndex: 10 }} />

                  <div>
                    <div className="flex justify-between items-center">
                      <h1 className="text-lg font-semibold text-gray-800">Task ID #{item.task_code}</h1>
                      <Flex gap={4} align="center">
                        {item.starred
                          ? <FaStar onClick={(e) => { e.stopPropagation(); starTask({ body: { starred: 0 }, id: item.id }); }} size={18} color="gold" />
                          : <FaRegStar onClick={(e) => { e.stopPropagation(); starTask({ body: { starred: 1 }, id: item.id }); }} size={18} />}
                        {item.task_status === "incomplete" && (
                          <Popover trigger="hover" content={
                            <Space direction="vertical">
                              <Button size="small" type="primary" style={{ width: 60 }}
                                onClick={(e) => { dispatch(setCommonModal({ title: "Update Task", content: <UpdateTask single={item} />, show: true })); e.stopPropagation(); }}>Edit</Button>
                              <Button size="small" type="primary" danger style={{ width: 60 }}
                                onClick={(e) => { removeTask(item.id); e.stopPropagation(); }}>Delete</Button>
                            </Space>}>
                            <Button type="text" icon={<EllipsisOutlined />} />
                          </Popover>
                        )}
                      </Flex>
                    </div>

                    <span className="text-xl font-semibold text-indigo-700">
                      {item.category_title}{" "}
                      <span className="text-sm font-bold text-indigo-500">x{item.quantity}</span>
                    </span>

                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.task_start_time
                        ? `Starts In: ${dayjs(item.task_start_date).format("DD MMM YYYY")} ${item.task_start_time}`
                        : `Will Start In: ${dayjs(item.start_date).format("DD MMM YYYY")} ${item.start_time}`}
                    </div>

                    <Flex justify="space-between" align="center">
                      <div className="mt-3 flex gap-2">
                        {item.task_status === "incomplete" && (
                          <Button type="primary" onClick={(e) => { startedTask(item.id); e.stopPropagation(); }}
                            style={{ background: "linear-gradient(135deg,#43a047,#66bb6a)", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" }}>
                            Start
                          </Button>
                        )}
                        {item.task_status === "inprogress" && (
                          <Button danger type="primary" onClick={(e) => { endedTask(item.id); e.stopPropagation(); }}
                            style={{ background: "linear-gradient(135deg,#e53935,#ef5350)", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600" }}>
                            End
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <CountdownTask item={item} />
                      </div>
                    </Flex>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {(taskItems?.count || 0) > 6 && (
            <Pagination className="mt-8" size="small" align="end"
              pageSizeOptions={["10","20","30","50","100"]}
              current={page} pageSize={pageSize} total={taskItems?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange} showSizeChanger />
          )}
        </Col>

        {/* ── Compact Sidebar ── */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Sidebar>

            {/* Starred */}
            <SidebarSection>
              <StarBtn
                active={filter.starred === 1}
                onClick={() => setFilter({ ...filter, starred: filter.starred === 1 ? 0 : 1, offset: 0 })}>
                {filter.starred === 1
                  ? <StarFilled  style={{ fontSize: 13, color: "#f59e0b" }} />
                  : <StarOutlined style={{ fontSize: 13, color: "#9ca3af" }} />}
                <span>Starred tasks</span>
              </StarBtn>
            </SidebarSection>

            {/* Categories as chips */}
            <SidebarSection>
              <SectionLabel>Categories</SectionLabel>
              <ChipGrid>
                {listCategory.map((item) => {
                  const active = listIds.includes(String(item.id));
                  return (
                    <Chip
                      key={item.id}
                      active={active}
                      onClick={() => toggleCat(String(item.id))}
                    >
                      {item.title}
                    </Chip>
                  );
                })}
              </ChipGrid>
            </SidebarSection>

          </Sidebar>
        </Col>
      </Row>
    </div>
  );
};

export default TaskManager;