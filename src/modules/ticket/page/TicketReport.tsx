import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Dropdown, Input, Space, Select } from "antd";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
import { useGetTicketReportListQuery } from "../api/ticketEndpoint";
import { TicketReportColumn } from "../utils/TicketReportColumns";
import { useGetAssignCategoryListQuery } from "../../assignCategory/api/assignCategoryEndPoint";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { rangePreset } from "../../../common/rangePreset";
const { Option } = Select;

const TicketReport = ({ ticketSolver }: { ticketSolver?: string }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "50");
  const skipValue = (page - 1) * pageSize;

  const { data: profile } = useGetMeQuery();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });

  const unitOption = useMemo(() => {
    const unitOptionForAdmin = unitData?.data?.filter((unit) =>
      profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
    );
    return profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;
  }, [unitData?.data, profile?.data?.searchAccess, profile?.data?.role_id]);

  const [localFilters, setLocalFilters] = useState<any>({
    start_date: undefined,
    end_date: undefined,
    key: ticketSolver || undefined,
    unit: undefined,
    status: undefined,
    priority: undefined,
    category: undefined,
  });

  // Memoize the API filter to prevent unnecessary re-renders
  const apiFilter = useMemo(() => ({
    limit: pageSize,
    offset: skipValue,
    ...(localFilters.start_date && { start_date: localFilters.start_date }),
    ...(localFilters.end_date && { end_date: localFilters.end_date }),
    ...(localFilters.key && { key: localFilters.key }),
    ...(localFilters.unit && { unit: localFilters.unit }),
    ...(localFilters.status && { status: localFilters.status }),
    ...(localFilters.priority && { priority: localFilters.priority }),
    ...(localFilters.category && { category: localFilters.category }),
  }), [pageSize, skipValue, localFilters]);

  const { data, isLoading, isFetching } = useGetTicketReportListQuery(apiFilter);

  // Update local filters when ticketSolver prop changes
  useEffect(() => {
    if (ticketSolver) {
      setLocalFilters((prev: any) => ({ ...prev, key: ticketSolver }));
    }
  }, [ticketSolver]);

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
    // Reset to first page when filters change
    if (key !== 'limit' && key !== 'offset') {
      setSearchParams({ page: "1", pageSize: String(pageSize) });
    }
  };

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      page: String(pagination.current),
      pageSize: String(pagination.pageSize),
    });
  };

  return (
    <div>
      <Card
        title="Ticket Report"
        style={{
          boxShadow: "0 0 0 1px rgba(0,0,0,.05)",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: "12px",
          }}
        >
          <DatePicker.RangePicker
            presets={rangePreset}
            onChange={(_, e) => {
              handleFilterChange('start_date', e[0]);
              handleFilterChange('end_date', e[1]);
            }}
          />
          <div style={{ width: "160px" }}>
            <Input
              prefix={<SearchOutlined />}
              defaultValue={ticketSolver}
              onChange={(e) => handleFilterChange('key', e.target.value)}
              placeholder="Search..."
              allowClear
            />
          </div>
          <Select
            style={{ width: "160px" }}
            loading={unitIsLoading}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => handleFilterChange('unit', e)}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
          <Select
            style={{ width: "160px" }}
            onChange={(e) => handleFilterChange('status', e)}
            placeholder="Select Status"
            allowClear
          >
            <Option value="inprogress">IN PROGRESS</Option>
            <Option value="solved">SOLVED</Option>
            <Option value="unsolved">UNSOLVED</Option>
            <Option value="forward">FORWARD</Option>
          </Select>
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
                  style={{ width: "100%", marginBottom: 8 }}
                  onChange={(e) => handleFilterChange('priority', e)}
                  placeholder="Select Priority"
                  allowClear
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>

                <Select
                  style={{ width: "100%", marginBottom: 8 }}
                  loading={categoryLoading}
                  placeholder="Select Category"
                  showSearch
                  optionFilterProp="children"
                  onChange={(e) => handleFilterChange('category', e)}
                  options={categoryData?.data?.map((item: any) => ({
                    value: item.id,
                    label: item.title,
                  }))}
                  allowClear
                />
              </div>
            )}
          >
            <Button icon={<FilterOutlined />}>Filters</Button>
          </Dropdown>
          <Space>
            <ExcelDownload
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
          </Space>
        </div>
        <div>
          <Table
            rowKey="id"
            size="small"
            bordered
            loading={isLoading || isFetching}
            dataSource={data?.data || []}
            columns={TicketReportColumn()}
            scroll={{ x: true }}
            pagination={{
              current: page,
              pageSize: pageSize,
              showSizeChanger: true,
              defaultPageSize: 50,
              pageSizeOptions: ["50", "100", "200", "300", "500", "1000"],
              total: data?.total || 0,
              showTotal: (total) => `Total ${total}`,
            }}
            onChange={handleTableChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default TicketReport;