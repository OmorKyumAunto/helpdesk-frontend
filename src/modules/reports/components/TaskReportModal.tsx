import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Select, Card, Space, Button, Statistic, Badge } from "antd";
import { useState, useEffect } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetTaskReportQuery } from "../api/reportsEndPoints";
import dayjs from "dayjs";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";

const { Option } = Select;

const TaskReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [listIds, setListIds] = useState([]);
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

  const activeFilterCount = Object.keys(filter).filter(
    key => filter[key] !== undefined && filter[key] !== null && filter[key] !== ''
  ).length + (listIds.length > 0 ? 1 : 0);

  return (
    <div style={{ padding: '8px' }}>
      {/* Header Section with Stats */}
      <Card 
        bordered={false} 
        style={{ 
          marginBottom: 16,
          background: 'linear-gradient(135deg, #01315bff 0%, #06afb8ff 100%)',
          color: 'white'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={12} sm={12} md={8}>
            <Statistic
              title={<span style={{  color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Total Tasks</span>}
              value={data?.query_data?.total_count || 0}
              valueStyle={{color: 'white', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px'}}>Active Filters</span>}
              value={activeFilterCount}
              valueStyle={{ color: 'white', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 600}}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>Quick Actions</span>
              <Space wrap>
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
                    "Starred",
                    "Task Start Date",
                    "Task End Date",
                    "Task Start Time",
                    "Task End Time",
                    "Quantity",
                    "User Name",
                    "User Employee ID",
                    "Created At",
                    "Overdue",
                  ]}
                  excelData={
                    data?.data?.length
                      ? data?.data?.map(
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
                            starred,
                            task_start_date,
                            task_end_date,
                            task_start_time,
                            task_end_time,
                            quantity,
                            user_name,
                            user_employee_id,
                            created_at,
                            overdue,
                          }) => {
                            return {
                              "Category Title": category_title,
                              Description: description,
                              "Set Time": set_time,
                              "Total Set Time": total_set_time,
                              Format: format,
                              "Start Date": dayjs(start_date).format("DD-MM-YYYY"),
                              "Start Time": start_time,
                              "Task Code": task_code,
                              "Task Status": task_status,
                              Starred: starred,
                              "Task Start Date":
                                dayjs(task_start_date).format("DD-MM-YYYY"),
                              "Task End Date":
                                dayjs(task_end_date).format("DD-MM-YYYY"),
                              "Task Start Time": task_start_time,
                              "Task End Time": task_end_time,
                              Quantity: quantity,
                              "User Name": user_name,
                              "User Employee ID": user_employee_id,
                              "Created At": created_at,
                              Overdue: overdue,
                            };
                          }
                        )
                      : []
                  }
                />
                <PDFDownload
                  PDFFileName="task_report_query_data"
                  fileHeader="Task Report Query Data"
                  PDFHeader={[
                    "Searching Keyword",
                    "Start Date",
                    "End Date",
                    "User Name",
                    "Task Status",
                    "Unit Name",
                    "Overdue",
                    "Total Count",
                  ]}
                  PDFData={{
                    Key: data?.query_data?.key || "Not Applied",
                    "Start Date": data?.query_data?.start_date
                      ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                      : "Not Applied",
                    "End Date": data?.query_data?.end_date
                      ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                      : "not Applied",
                    "User Name": data?.query_data?.user_name || "All",
                    "Task Status": data?.query_data?.task_status || "All",
                    "Unit Name": data?.query_data?.unit_name || "All",
                    Overdue: data?.query_data?.overdue || "All",
                    "Total Count": data?.query_data?.total_count || 0,
                  }}
                />
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filters Section */}
      <Card 
        title={
          <Space>
            <FilterOutlined />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge count={activeFilterCount} style={{ backgroundColor: '#52c41a' }} />
            )}
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            {activeFilterCount > 0 && (
              <Button 
                type="link" 
                icon={<ClearOutlined />} 
                onClick={clearAllFilters}
                danger
              >
                Clear All
              </Button>
            )}
            <Button 
              type="text" 
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              {isFilterExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        {isFilterExpanded && (
          <Row gutter={[16, 16]}>
            {/* Search */}
            <Col xs={24}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Search Tasks
                </label>
              </div>
              <Input
                size="large"
                prefix={<SearchOutlined style={{ color: '#bfbfbf', fontSize: '16px' }} />}
                onChange={(e) => setFilter({ ...filter, key: e.target.value })}
                placeholder="Search tasks..."
                allowClear
                value={filter.key}
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              />
            </Col>

            {/* Unit Selection */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Unit Name
                </label>
              </div>
              <Select
                size="large"
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit Name"
                showSearch
                optionFilterProp="children"
                onChange={(e) => setFilter({ ...filter, unit_id: e })}
                options={unitData?.data?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                allowClear
                value={filter.unit_id}
                popupMatchSelectWidth={false}
              />
            </Col>

            {/* Admin Selection */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Admin
                </label>
              </div>
              <Select
                size="large"
                loading={adminLoading}
                placeholder="Search Admin"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={allAdmin?.data?.user_list?.map((item: UserList) => ({
                  value: item.user_id,
                  label: `[${item.employee_id}] ${item.name}`,
                }))}
                onChange={(e) => setFilter({ ...filter, user_id: e })}
                allowClear
                style={{ width: "100%" }}
                value={filter.user_id}
                popupMatchSelectWidth={false}
              />
            </Col>

            {/* Category - Multiple Select */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Category
                </label>
              </div>
              <Select
                size="large"
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
                popupMatchSelectWidth={false}
                maxTagCount="responsive"
              />
            </Col>

            {/* Task Status */}
            <Col xs={24} sm={12} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Task Status
                </label>
              </div>
              <Select
                size="large"
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
            </Col>

            {/* Overdue */}
            <Col xs={24} sm={12} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Overdue
                </label>
              </div>
              <Select
                size="large"
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
            </Col>

            {/* Date Range */}
           <Col xs={24} lg={12}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Date Range
                </label>
              </div>
              <DatePicker.RangePicker
                size="large"
                presets={rangePreset}
                style={{ width: "100%" }}
                placeholder={['Start Date', 'End Date']}
                onChange={(_, e) =>
                  setFilter({
                    ...filter,
                    start_date: e[0],
                    end_date: e[1],
                  })
                }
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* Applied Filters Summary */}
      {activeFilterCount > 0 && (
        <Card 
          size="small" 
          bordered={false}
          style={{ 
            marginBottom: 16, 
            background: '#f0f9ff',
            borderLeft: '3px solid #a8edea'
          }}
        >
          <Space wrap size="small">
            <span style={{ fontWeight: 500, color: '#0891b2' }}>Active Filters:</span>
            {filter.key && <Badge status="processing" text={`Search: "${filter.key}"`} />}
            {filter.unit_id && <Badge status="processing" text="Unit Selected" />}
            {filter.user_id && <Badge status="processing" text="Admin Selected" />}
            {filter.start_date && <Badge status="processing" text="Date Range Applied" />}
            {listIds.length > 0 && <Badge status="processing" text={`${listIds.length} Categories Selected`} />}
            {filter.task_status && <Badge status="processing" text={`Status: ${filter.task_status}`} />}
            {filter.overdue && <Badge status="processing" text={`Overdue: ${filter.overdue === '1' ? 'Yes' : 'No'}`} />}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default TaskReportModal;