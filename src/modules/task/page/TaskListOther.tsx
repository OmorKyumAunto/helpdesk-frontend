import { SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Pagination,
  Row,
  Segmented,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { sanitizeFormValue } from "react-form-sanitization";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setCommonModal } from "../../../app/slice/modalSlice";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import {
  useEndTaskMutation,
  useGetOtherTaskListQuery,
  useStartTaskMutation,
} from "../api/taskEndpoint";
import { ITaskParams } from "../types/taskTypes";
import SingleTask from "./SingleTask";

/* ── Header ─────────────────────────────────────────────────────── */
const HeaderWrapper = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
`;
const HeaderInner = styled.div`display:flex;flex-direction:column;gap:10px;`;
const BrandRow = styled.div`
  display:flex;align-items:center;gap:10px;
  h1{margin:0;font-size:18px;font-weight:700;color:#111827;white-space:nowrap;}
`;
const FilterBar = styled.div`
  display:flex;flex-wrap:wrap;gap:8px;align-items:center;
  &>*{flex:1 1 160px;min-width:0;max-width:100%;}
  @media(max-width:480px){&>*{flex:1 1 100%;}}
`;
const SearchWrap = styled.div`.ant-input-affix-wrapper{width:100%;}`;
const SegmentedWrap = styled.div`
  overflow-x:auto;-webkit-overflow-scrolling:touch;
  .ant-segmented{width:100%;font-weight:bold;background:#cccccc;}
  .ant-segmented-item{flex:1;text-align:center;white-space:nowrap;}
  @media(max-width:400px){.ant-segmented{font-size:12px;}}
`;

/* ── Sidebar ─────────────────────────────────────────────────────── */
const Sidebar = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;
const SidebarSection = styled.div`
  padding: 12px 14px;
`;
const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  margin-bottom: 10px;
`;
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
const ListTaskOther = () => {
  const [othersValue, setOthersValue] = useState("others");
  const { data } = useGetTaskCategoryQuery();
  const dispatch = useDispatch();
  const listCategory = data?.data || [];
  const [startedTask] = useStartTaskMutation();
  const [endedTask]   = useEndTaskMutation();
  const [listIds, setListIds] = useState<string[]>([]);
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const skipValue = (Number(page) - 1) * Number(pageSize);

  const [filter, setFilter] = useState<ITaskParams>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter((p) => ({ ...p, limit: Number(pageSize), offset: skipValue }));
  }, [page, pageSize, skipValue]);

  const sanitizeData = sanitizeFormValue(filter);

  const { data: otherTaskListTo, isFetching: toFetching, isLoading: toLoading } =
    useGetOtherTaskListQuery({ assign_to: 1, category: listIds.map(Number), ...sanitizeData });

  const { data: otherTaskListOthers, isLoading, isFetching } =
    useGetOtherTaskListQuery({ assign_from_others: 1, category: listIds.map(Number), ...sanitizeData });

  const otherTaskList = othersValue === "to" ? otherTaskListTo : otherTaskListOthers;

  const handlePaginationChange = (current: number, size: number) => {
    setPage(current);
    setPageSize(size);
    setFilter({ ...filter, offset: (current - 1) * size, limit: size });
  };

  const toggleCat = (id: string) =>
    setListIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  return (
    <div>
      {/* ── Header ── */}
      <HeaderWrapper>
        <HeaderInner>
          <BrandRow>
            <svg xmlns="http://www.w3.org/2000/svg"
              style={{ width: 28, height: 28, color: "#2563eb", flexShrink: 0 }}
              viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            <h1>Task Manager</h1>
          </BrandRow>

          <FilterBar>
            <SegmentedWrap>
              <Segmented<string>
                options={[
                  { label: "Assign From Others", value: "others" },
                  { label: "Assign To",          value: "to"     },
                ]}
                onChange={(v) => setOthersValue(v)}
              />
            </SegmentedWrap>
            <SearchWrap>
              <Input placeholder="Search tasks..." prefix={<SearchOutlined />}
                onChange={(e) => setFilter({ ...filter, key: e.target.value, offset: 0 })} />
            </SearchWrap>
          </FilterBar>
        </HeaderInner>
      </HeaderWrapper>

      {/* ── Main ── */}
      <Row gutter={[16, 16]} style={{ padding: 12 }}>

        {/* Task cards */}
        <Col xs={24} sm={24} md={24} lg={18}>
          <Row gutter={[14, 14]}>
            {otherTaskList?.data?.map((item) => (
              <Col key={item.id} xs={24} sm={24} md={12}>
                <Card bordered={false}
                  loading={isLoading || isFetching || toLoading || toFetching}
                  onClick={() => othersValue !== "to" && dispatch(setCommonModal({
                    content: <SingleTask id={item.id} />,
                    title: "Task Details", width: "72%", show: true,
                  }))}
                  style={{ backgroundColor: "#f7f9fc", borderRadius: "16px", boxShadow: "0 12px 24px rgba(0,0,0,0.1)", transition: "transform 0.3s ease", cursor: "pointer", height: "100%", position: "relative" }}
                  className="sla-card"
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>

                  <Badge.Ribbon
                    text={item.task_status === "complete" ? "Complete" : item.task_status === "incomplete" ? "Incomplete" : "In Progress"}
                    color={item.task_status === "complete" ? "green" : item.task_status === "incomplete" ? "red" : "blue"}
                    style={{ position: "absolute", top: "40px", right: "-30px", fontSize: "12px", fontWeight: "600", padding: "5px 12px", zIndex: 10 }} />

                  <div>
                    <div className="flex justify-between items-center">
                      <h1 className="text-lg font-semibold text-gray-800">Task ID #{item.task_code}</h1>
                    </div>

                    <div>
                      <span className="text-xl font-semibold text-indigo-700">
                        {item.category_title}{" "}
                        <span className="text-sm font-bold text-indigo-500">x{item.quantity}</span>
                      </span>
                      {othersValue !== "to" && (
                        <div>
                          <span className="text-sm font-semibold">
                            From: {item.assign_from_name} ({item.assign_from_employee_id})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.task_start_time
                        ? `Starts In: ${dayjs(item.task_start_date).format("DD MMM YYYY")} ${item.task_start_time}`
                        : `Will Start In: ${dayjs(item.start_date).format("DD MMM YYYY")} ${item.start_time}`}
                    </div>

                    <Flex justify="space-between" align="center">
                      {othersValue !== "to" && (
                        <div className="mt-3 flex gap-2">
                          {item.task_status === "incomplete" && (
                            <Button type="primary" onClick={(e) => { startedTask(item.id); e.stopPropagation(); }}
                              style={{ background: "linear-gradient(135deg,#43a047,#66bb6a)", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", boxShadow: "0 3px 8px rgba(76,175,80,0.2)" }}>
                              Start
                            </Button>
                          )}
                          {item.task_status === "inprogress" && (
                            <Button danger type="primary" onClick={(e) => { endedTask(item.id); e.stopPropagation(); }}
                              style={{ background: "linear-gradient(135deg,#e53935,#ef5350)", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "600", boxShadow: "0 3px 8px rgba(244,67,54,0.2)" }}>
                              End
                            </Button>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-3" />
                    </Flex>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {(otherTaskList?.count || 0) > 6 && (
            <Pagination className="mt-8" size="small" align="end"
              pageSizeOptions={["10","20","30","50","100"]}
              current={page} pageSize={pageSize} total={otherTaskList?.count || 0}
              showTotal={(total) => `Total ${total}`}
              onChange={handlePaginationChange} showSizeChanger />
          )}
        </Col>

        {/* ── Compact Sidebar ── */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Sidebar>
            <SidebarSection>
              <SectionLabel>Categories</SectionLabel>
              <ChipGrid>
                {listCategory.map((item) => {
                  const active = listIds.includes(String(item.id));
                  return (
                    <Chip key={item.id} active={active} onClick={() => toggleCat(String(item.id))}>
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

export default ListTaskOther;