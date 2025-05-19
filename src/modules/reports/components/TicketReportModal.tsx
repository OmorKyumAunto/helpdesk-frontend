import { SearchOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Select } from "antd";
import { useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import ExcelDownload from "../../../common/ExcelDownload/ExcelDownload";
import { rangePreset } from "../../../common/rangePreset";
import { useGetCategoryListQuery } from "../../Category/api/categoryEndPoint";
import { useGetTicketReportQuery } from "../../ticket/api/ticketEndpoint";
import { useGetUnitsQuery } from "../../Unit/api/unitEndPoint";
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
      </Row>
    </div>
  );
};

export default TicketReportModal;
