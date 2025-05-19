import { SearchOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Select } from "antd";
import { useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
import PDFDownload from "../../../common/PDFDownload/PDFDownload";
import dayjs from "dayjs";
const { Option } = Select;

const TicketReportModal = () => {
  const [filter, setFilter] = useState<any>({});
  const { data: profile } = useGetMeQuery();
  const { data: unitData, isLoading: unitIsLoading } = useGetUnitsQuery({
    status: "active",
  });
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryListQuery({ status: "active" });
  const unitOptionForAdmin = unitData?.data?.filter((unit) =>
    profile?.data?.searchAccess?.some((item: any) => item?.unit_id === unit?.id)
  );
  const unitOption =
    profile?.data?.role_id === 2 ? unitOptionForAdmin : unitData?.data;
  const { data, isLoading, isFetching } = useGetTicketReportQuery({
    ...filter,
  });
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            prefix={<SearchOutlined />}
            onChange={(e) => setFilter({ ...filter, key: e.target.value })}
            placeholder="Search..."
            allowClear
          />
        </Col>
        <Col span={24}>
          <Select
            loading={unitIsLoading}
            style={{ width: "100%" }}
            placeholder="Select Unit Name"
            showSearch
            optionFilterProp="children"
            onChange={(e) => setFilter({ ...filter, unit: e })}
            options={unitOption?.map((unit: any) => ({
              value: unit.id,
              label: unit.title,
            }))}
            allowClear
          />
        </Col>
        <Col span={24}>
          <DatePicker.RangePicker
            presets={rangePreset}
            style={{ width: "100%" }}
            onChange={(_, e) =>
              setFilter({
                ...filter,
                start_date: e[0],
                end_date: e[1],
              })
            }
          />
        </Col>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            onChange={(e) => setFilter({ ...filter, status: e })}
            placeholder="Select Status"
            allowClear
          >
            <Option value="inprogress">IN PROGRESS</Option>
            <Option value="solved">SOLVED</Option>
            <Option value="unsolved">UNSOLVED</Option>
            <Option value="forward">FORWARD</Option>
          </Select>
        </Col>
        <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
            onChange={(e) => setFilter({ ...filter, priority: e })}
            placeholder="Select Priority"
            allowClear
          >
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
            <Option value="urgent">Urgent</Option>
          </Select>
        </Col>
        <Col span={24}>
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
          />
        </Col>
        <Col span={24}>
          <Select
            style={{ width: "100%", marginBottom: 8 }}
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
          />
        </Col>
        <Col span={24}>
          <ExcelDownload
            isLoading={isLoading || isFetching}
            width="100%"
            excelName={"Asset Report"}
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
        </Col>
        <Col span={24}>
          <PDFDownload
            PDFFileName="ticket_report_query_data"
            fileHeader="Ticket Report Query Data"
            PDFHeader={[
              "Key",
              "Start Date",
              "End Date",
              "Category",
              "Priority",
              "Status",
              "Overdue",
              "Unit Name",
              "Employee Name",
              "Employee ID",
              "Report Generate Employee Name",
              "Report Generate Employee ID",
            ]}
            PDFData={{
              Key: data?.query_data?.key || "All",
              "Start Date": data?.query_data?.start_date
                ? dayjs(data?.query_data?.start_date).format("DD-MM-YYYY")
                : "ALL",
              "End Date": data?.query_data?.end_date
                ? dayjs(data?.query_data?.end_date).format("DD-MM-YYYY")
                : "ALL",
              Category: data?.query_data?.category || "ALL",
              Priority: data?.query_data?.priority || "ALL",
              Status: data?.query_data?.status || "ALL",
              Overdue: data?.query_data?.overdue || "ALL",
              "Unit Name": data?.query_data?.unit_name || "ALL",
              "Employee Name": data?.query_data?.employee_name || "ALL",
              "Employee ID": data?.query_data?.employee_id || "ALL",
              "Report Generate Employee Name":
                data?.query_data?.report_generate_employee_name,
              "Report Generate Employee ID":
                data?.query_data?.report_generate_employee_id,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TicketReportModal;
