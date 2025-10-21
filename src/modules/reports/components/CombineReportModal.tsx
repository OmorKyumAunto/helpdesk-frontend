import { Col, DatePicker, Row, Select, Card, Space, Button, Statistic, Badge } from "antd";
import { useEffect, useState } from "react";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import { rangePreset } from "../../../common/rangePreset";
import dayjs from "dayjs";
import { useGetAdminWiseUnitsQuery, useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { UserList } from "../../Unit/types/unitTypes";
import { useGetCombineReportQuery } from "../api/reportsEndPoints";
import CombineReportPDFDownload from "./PDFDownloadForCombineReport";

const { Option } = Select;

const CombineReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({ status: "active" });
  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(filter.unit || 0, { skip: !filter.unit });
  const { data } = useGetCombineReportQuery({ ...filter });

  const clearAllFilters = () => setFilter({});
  const activeFilterCount = Object.keys(filter).filter(key => filter[key] !== undefined && filter[key] !== null && filter[key] !== '').length;

  return (
    <div style={{ padding: '8px' }}>
      {/* Header Section */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          background: 'linear-gradient(135deg, #002fffff 0%, #042670ff 100%)',
          color: 'white',
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Total Tickets</span>}
              value={data?.data?.total_ticket || 0}
              valueStyle={{ color: 'white', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Total Tasks</span>}
              value={data?.data?.total_task || 0}
              valueStyle={{ color: 'white', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Active Filters</span>}
              value={activeFilterCount}
              valueStyle={{ color: 'white', fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 600 }}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Quick Actions</span>
              <CombineReportPDFDownload
                PDFFileName="combine_report_query_data"
                fileHeader="Combined Report"
                queryData={data?.query_data!}
                PDFHeader={[
                  "Average Ticket Time",
                  "Average Task Time",
                  "Total Avgerage Time",
                  "SLA Maintained Time",
                  "Actual Time Taken",
                  "Expected Time",
                  "Avg Work Time Per Day",
                  "Avg SLA Work Time Per Day",
                  "Total Ticket Solved",
                  "Total Task Completed",
                  "Total Ticket and Task Solved",
                  "From Date",
                  "To Date",
                  "Assigned Unit",
                ]}
                PDFData={{
                  "Average Ticket Time": data?.data?.total_avg_ticket || "Not Applied",
                  "Average Task Time": data?.data?.total_avg_task || "Not Applied",
                  "Total Avgerage Time": data?.data?.total_avg_ticket_task || "Not Applied",
                  "SLA Maintained Time": data?.data?.combine_avg_sla_time || "Not Applied",
                  "Actual Time Taken": data?.data?.total_actual_time || "Not Applied",
                  "Expected Time": data?.data?.expected_work_time_8h_per_day || "Not Applied",
                  "Avg Work Time Per Day": data?.data?.avg_work_hours_per_day || "Not Applied",
                  "Avg SLA Work Time Per Day": data?.data?.avg_work_hours_per_day_sla_wise || "Not Applied",
                  "Total Ticket Solved": data?.data?.total_ticket || "Not Applied",
                  "Total Task Completed": data?.data?.total_task || "Not Applied",
                  "Total Ticket and Task Solved": data?.data?.total_ticket_task || "Not Applied",
                  "From Date": data?.query_data?.start_date ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY") : "Not Applied",
                  "To Date": data?.query_data?.end_date ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY") : "Not Applied",
                  "Assigned Unit": data?.query_data?.admin_assign_unit_name || "Not Applied",
                }}
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Performance Metrics */}
      {/* Performance Metrics */}
      {data?.data && (
        <Card bordered={false} style={{ marginBottom: 16 }} title="Performance Metrics">
          <Row gutter={[12, 12]}>
            {[
              { title: "Avg Ticket Time", value: data?.data?.total_avg_ticket },
              { title: "Avg Task Time", value: data?.data?.total_avg_task },
              { title: "Total Avg Time", value: data?.data?.total_avg_ticket_task },
              { title: "SLA Maintained", value: data?.data?.combine_avg_sla_time },
              { title: "Work Time/Day", value: data?.data?.avg_work_hours_per_day },
              { title: "SLA Work Time/Day", value: data?.data?.avg_work_hours_per_day_sla_wise },
            ].map((item, idx) => (
              <Col xs={24} sm={12} md={8} lg={8} xl={8} key={idx}>
                <Card
                  size="small"
                  bordered={false}
                  style={{
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '6px',
                    minHeight: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    wordWrap: 'break-word', // allow text wrap
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>
                    {item.value || "N/A"}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Filters Section */}
      <Card
        title={
          <Space>
            <FilterOutlined />
            <span>Filters</span>
            {activeFilterCount > 0 && <Badge count={activeFilterCount} style={{ backgroundColor: '#52c41a' }} />}
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            {activeFilterCount > 0 && <Button type="link" icon={<ClearOutlined />} onClick={clearAllFilters} danger>Clear All</Button>}
            <Button type="text" onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
              {isFilterExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        {isFilterExpanded && (
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12}>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Unit Name</label>
              <Select
                size="middle"
                loading={unitIsLoading}
                style={{ width: "100%" }}
                placeholder="Select Unit Name"
                showSearch
                optionFilterProp="children"
                onChange={(e) => setFilter({ ...filter, unit: e })}
                options={unitData?.data?.map((unit: any) => ({ value: unit.id, label: unit.title }))}
                allowClear
                value={filter.unit}
              />
            </Col>

            <Col xs={24} sm={12}>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Admin</label>
              <Select
                size="middle"
                loading={adminLoading}
                placeholder="Search Admin"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                options={allAdmin?.data?.user_list?.map((item: UserList) => ({
                  value: item.user_id,
                  label: `[${item.employee_id}] ${item.name}`,
                }))}
                onChange={(e) => setFilter({ ...filter, user_id: e })}
                allowClear
                style={{ width: "100%" }}
                value={filter.user_id}
              />
            </Col>

            <Col xs={24}>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: 4 }}>Date Range</label>
              <DatePicker.RangePicker
                size="middle"
                presets={rangePreset}
                style={{ width: "100%" }}
                placeholder={['Start Date', 'End Date']}
                onChange={(_, e) => setFilter({ ...filter, start_date: e[0], end_date: e[1] })}
              />
            </Col>
          </Row>
        )}
      </Card>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <Card size="small" bordered={false} style={{ marginBottom: 16, background: '#fff7e6', borderLeft: '3px solid #ffa940' }}>
          <Space wrap size="small">
            <span style={{ fontWeight: 500, color: '#d48806' }}>Active Filters:</span>
            {filter.unit && <Badge status="processing" text="Unit Selected" />}
            {filter.user_id && <Badge status="processing" text="Admin Selected" />}
            {filter.start_date && <Badge status="processing" text="Date Range Applied" />}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default CombineReportModal;
