import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { ITicketDashboardReport } from "../types/ticketTypes";
import { formatTimeDifference } from "./timeFormat";

export const TicketReportColumn =
  (): TableProps<ITicketDashboardReport>["columns"] => {
    return [
      //   {
      //     title: "No",
      //     render: (_, __, index) => index + 1,
      //   },
      {
        title: "Ticket ID",
        dataIndex: "ticket_id",
        key: "ticket_id",
      },
      {
        title: "Ticket Subject",
        dataIndex: "subject",
        key: "subject",
      },
      {
        title: "Status",
        dataIndex: "ticket_status",
        key: "ticket_status",
      },
      {
        title: "Category",
        dataIndex: "ticket_category_title",
        key: "ticket_category_title",
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
      },
      {
        title: "Asset Serial No",
        dataIndex: "asset_serial_number",
        key: "asset_serial_number",
      },
      {
        title: "Raised By",
        dataIndex: "ticket_created_employee_name",
        key: "ticket_created_employee_name",
      },
      {
        title: "Solved By",
        dataIndex: "ticket_solved_employee_name",
        key: "ticket_solved_employee_name",
      },
      {
        title: "Solving Time",
        render: (record) =>
          formatTimeDifference(
            dayjs(record.ticket_created_at),
            dayjs(record.ticket_updated_at)
          ),
      },
      {
        title: "Unit Name",
        dataIndex: "asset_unit_title",
        key: "asset_unit_title",
      },
    ];
  };
