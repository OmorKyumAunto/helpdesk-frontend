import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Dropdown, Input, Space, Select } from "antd";
import { Table } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { generatePagination } from "../../../common/TablePagination copy";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import { useGetMeQuery } from "../../../app/api/userApi";
import { useGetActiveLocationsQuery } from "../../location/api/locationEndPoint";
import { useGetTicketReportQuery } from "../api/ticketEndpoint";
import { TicketReportColumn } from "../utils/TicketReportColumns";
import { useGetAssignCategoryListQuery } from "../../assignCategory/api/assignCategoryEndPoint";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { rangePreset } from "../../../common/rangePreset";
const { Option } = Select;

const TicketReport = ({ ticketSolver }: { ticketSolver?: string }) => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
  });

  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    pageSize: "50",
  });
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";
  const skipValue = (Number(page) - 1) * Number(pageSize);
  const { data: profile } = useGetMeQuery();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;

  const [filter, setFilter] = useState<any>({
    limit: Number(pageSize),
    offset: skipValue,
  });

  useEffect(() => {
    setFilter((prevFilter: any) => ({
      ...prevFilter,
      limit: Number(pageSize),
      offset: skipValue,
      key: ticketSolver || prevFilter?.key,
    }));
  }, [page, pageSize, skipValue, ticketSolver]);
  const { data, isLoading, isFetching } = useGetTicketReportQuery({
    ...filter,
  });
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
            onChange={(_, e) =>
              setFilter({
                ...filter,
                start_date: e[0],
                end_date: e[1],
                offset: 0,
              })
            }
          />
          <div style={{ width: "160px" }}>
            <Input
              prefix={<SearchOutlined />}
              defaultValue={ticketSolver}
              onChange={(e) =>
                setFilter({ ...filter, key: e.target.value, offset: 0 })
              }
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
            onChange={(e) => setFilter({ ...filter, unit: e, offset: 0 })}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
          <Select
            style={{ width: "160px" }}
            onChange={(e) => setFilter({ ...filter, status: e, offset: 0 })}
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
                  onChange={(e) =>
                    setFilter({ ...filter, priority: e, offset: 0 })
                  }
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
                  onChange={(e) =>
                    setFilter({ ...filter, category: e, offset: 0 })
                  }
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
                        ticket_solved_employee_name,
                        ticket_solved_employee_id,
                        asset_unit_title,
                        ticket_updated_at,
                        ticket_created_at,
                      }) => {
                        // Parse timestamps
                        const updatedAt = new Date(ticket_updated_at);
                        const createdAt = new Date(ticket_created_at);

                        // Calculate time difference in milliseconds
                        const timeDifference =
                          updatedAt.getTime() - createdAt.getTime();

                        // Convert time difference to human-readable format (e.g., hours, minutes)
                        const days = Math.floor(
                          timeDifference / (1000 * 60 * 60 * 24)
                        );
                        const hours = Math.floor(
                          (timeDifference % (1000 * 60 * 60 * 24)) /
                            (1000 * 60 * 60)
                        );
                        const minutes = Math.floor(
                          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                        );

                        // Build solvingTime string dynamically
                        const solvingTimeParts = [];
                        if (days > 0) solvingTimeParts.push(`${days}d`);
                        if (hours > 0) solvingTimeParts.push(`${hours}h`);
                        if (minutes > 0) solvingTimeParts.push(`${minutes}m`);

                        const solvingTime = solvingTimeParts.join(" ") || "0m"; // Default to "0m" if all parts are 0

                        return {
                          "Ticket ID": ticket_id,
                          "Ticket Subject": subject,
                          "Ticket Status": ticket_status,
                          Category: ticket_category_title,
                          Priority: priority,
                          "Asset Serial Number": asset_serial_number,
                          "Raised By": ticket_created_employee_name,
                          "Raiser ID": ticket_created_employee_id,
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
            dataSource={data?.data?.length ? data.data : []}
            columns={TicketReportColumn()}
            scroll={{ x: true }}
            pagination={{
              ...generatePagination(
                Number(data?.total),
                setPagination,
                pagination
              ),
              current: Number(page),
              showSizeChanger: true,
              defaultPageSize: 50,
              pageSizeOptions: ["50", "100", "200", "300", "500", "1000"],
              total: data ? Number(data?.total) : 0,
              showTotal: (total) => `Total ${total} `,
            }}
            onChange={(pagination) => {
              setSearchParams({
                page: String(pagination.current),
                pageSize: String(pagination.pageSize),
              });
              setFilter({
                ...filter,
                offset:
                  ((pagination.current || 1) - 1) * (pagination.pageSize || 50),
                limit: pagination.pageSize!,
              });
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default TicketReport;
