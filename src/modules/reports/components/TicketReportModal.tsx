import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Select, Card, Space, Button, Statistic, Badge } from "antd";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import {
  useGetAdminWiseUnitsQuery,
  useGetUnitsQuery,
} from "../../Unit/api/unitEndPoint";
import dayjs from "dayjs";
import { UserList } from "../../Unit/types/unitTypes";
import Lottie from "lottie-react";
import blueLoader from "../../../assets/blueloader.json";

const { Option } = Select;

const TicketReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  useEffect(() => {
    setFilter({});
  }, []);

  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: allAdmin, isLoading: adminLoading } = useGetAdminWiseUnitsQuery(
    filter.unit || 0,
    { skip: !filter.unit }
  );
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
  const { data, isLoading, isFetching } = useGetTicketReportQuery({
    ...filter,
  });

  const clearAllFilters = () => {
    setFilter({});
  };

  const activeFilterCount = Object.keys(filter).filter(
    key => filter[key] !== undefined && filter[key] !== null && filter[key] !== ''
  ).length;
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
    <div style={{ padding: '8px' }}>
      {/* Header Section with Stats */}
      <Card 
        bordered={false} 
        style={{ 
          marginBottom: 16,
          background: 'linear-gradient(135deg, #01315bff 0%, #00f2fe 100%)',
          color: 'white'
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={12} sm={12} md={8}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Total Tickets</span>}
              value={data?.query_data?.total_count || 0}
              valueStyle={{ color: 'white', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Active Filters</span>}
              value={activeFilterCount}
              valueStyle={{ color: 'white', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 600 }}
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>Quick Actions</span>
              <Space wrap>
                <ExcelDownload
                  isLoading={isLoading || isFetching}
                  excelName={"Ticket Report"}
                  excelTableHead={[
                    "Ticket ID",
                    "Ticket Subject",
                    "Ticket Status",
                    "Category",
                    "Priority",
                    "Asset Serial Number",
                    "Raised By",
                    "Raiser ID",
                    "Raiser Seating Unit",
                    "Raiser Seating Building",
                    "Raiser Seating Location",
                    "Solved By",
                    "Admin ID",
                    "Solving Time",
                    "Unit Name",
                  ]}
                  excelData={
                    data?.data?.length
                      ? data?.data?.map(
                        ({
                          ticket_id,
                          ticket_status,
                          subject,
                          priority,
                          ticket_category_title,
                          asset_serial_number,
                          ticket_created_employee_name,
                          ticket_created_employee_id,
                          seating_unit_name,
                          complex_name,
                          seating_location_name,
                          ticket_solved_employee_name,
                          ticket_solved_employee_id,
                          asset_unit_title,
                          ticket_updated_at,
                          ticket_created_at,
                        }) => {
                          const updatedAt = new Date(ticket_updated_at);
                          const createdAt = new Date(ticket_created_at);
                          const timeDifference = updatedAt.getTime() - createdAt.getTime();
                          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                          const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                          const solvingTimeParts = [];
                          if (days > 0) solvingTimeParts.push(`${days}d`);
                          if (hours > 0) solvingTimeParts.push(`${hours}h`);
                          if (minutes > 0) solvingTimeParts.push(`${minutes}m`);
                          const solvingTime = solvingTimeParts.join(" ") || "0m";

                          return {
                            "Ticket ID": ticket_id,
                            "Ticket Subject": subject,
                            "Ticket Status": ticket_status,
                            Category: ticket_category_title,
                            Priority: priority,
                            "Asset Serial Number": asset_serial_number,
                            "Raised By": ticket_created_employee_name,
                            "Raiser ID": ticket_created_employee_id,
                            "Raiser Seating Unit": seating_unit_name,
                            "Raiser Seating Building": complex_name,
                            "Raiser Seating Location": seating_location_name,
                            "Solved By": ticket_solved_employee_name,
                            "Admin ID": ticket_solved_employee_id,
                            "Unit Name": asset_unit_title,
                            "Solving Time": solvingTime,
                          };
                        }
                      )
                      : []
                  }
                />
                <PDFDownload
                  PDFFileName="ticket_report_query_data"
                  fileHeader="Ticket Report Query Data"
                  PDFHeader={[
                    "Searching Keyword",
                    "Start Date",
                    "End Date",
                    "Category",
                    "Priority",
                    "Status",
                    "Overdue",
                    "Unit Name",
                    "Total Count",
                  ]}
                  PDFData={{
                    Key: data?.query_data?.key || "Not Applied",
                    "Start Date": data?.query_data?.start_date
                      ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                      : "Not Applied",
                    "End Date": data?.query_data?.end_date
                      ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                      : "Not Applied",
                    Category: data?.query_data?.category || "ALL",
                    Priority: data?.query_data?.priority || "ALL",
                    Status: data?.query_data?.status || "ALL",
                    Overdue: data?.query_data?.overdue || "ALL",
                    "Unit Name": data?.query_data?.unit_name || "ALL",
                    "Total Count": data?.query_data?.total_count || "0",
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
                  Search Tickets
                </label>
              </div>
              <Input
                size="large"
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                onChange={(e) => setFilter({ ...filter, key: e.target.value })}
                placeholder="Search tickets..."
                allowClear
                value={filter.key}
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
                onChange={(e) => setFilter({ ...filter, unit: e })}
                options={unitData?.data?.map((unit: any) => ({
                  value: unit.id,
                  label: unit.title,
                }))}
                allowClear
                value={filter.unit}
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
              />
            </Col>

            {/* Category */}
            <Col xs={24} sm={12} lg={8}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Category
                </label>
              </div>
              <Select
                size="large"
                style={{ width: "100%" }}
                loading={categoryLoading}
                placeholder="Select Category"
                showSearch
                optionFilterProp="children"
                onChange={(e) => setFilter({ ...filter, category: e, offset: 0 })}
                options={categoryData?.data?.map((item: any) => ({
                  value: item.id,
                  label: item.title,
                }))}
                allowClear
                value={filter.category}
              />
            </Col>

            {/* Status */}
            <Col xs={24} sm={12} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Status
                </label>
              </div>
              <Select
                size="large"
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, status: e })}
                placeholder="Select Status"
                allowClear
                value={filter.status}
              >
                <Option value="inprogress">IN PROGRESS</Option>
                <Option value="solved">SOLVED</Option>
                <Option value="unsolved">UNSOLVED</Option>
                <Option value="forward">FORWARD</Option>
              </Select>
            </Col>

            {/* Priority */}
            <Col xs={24} sm={12} lg={6}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontWeight: 500, fontSize: '13px', color: '#666', display: 'block' }}>
                  Priority
                </label>
              </div>
              <Select
                size="large"
                style={{ width: "100%" }}
                onChange={(e) => setFilter({ ...filter, priority: e })}
                placeholder="Select Priority"
                allowClear
                value={filter.priority}
              >
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
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
                disabledDate={(current) => current && current > dayjs().endOf("day")}
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
            background: '#e6f7ff',
            borderLeft: '3px solid #00f2fe'
          }}
        >
          <Space wrap size="small">
            <span style={{ fontWeight: 500, color: '#00a2ae' }}>Active Filters:</span>
            {filter.key && <Badge status="processing" text={`Search: "${filter.key}"`} />}
            {filter.unit && <Badge status="processing" text="Unit Selected" />}
            {filter.user_id && <Badge status="processing" text="Admin Selected" />}
            {filter.start_date && <Badge status="processing" text="Date Range Applied" />}
            {filter.category && <Badge status="processing" text="Category Selected" />}
            {filter.status && <Badge status="processing" text={`Status: ${filter.status}`} />}
            {filter.priority && <Badge status="processing" text={`Priority: ${filter.priority}`} />}
            {filter.overdue && <Badge status="processing" text={`Overdue: ${filter.overdue === '1' ? 'Yes' : 'No'}`} />}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default TicketReportModal;