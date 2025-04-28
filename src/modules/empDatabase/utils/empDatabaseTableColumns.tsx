import { Tag } from "antd";
import { TableProps } from "antd/lib";
import dayjs from "dayjs";
import { ILogHistory } from "../types/empDatabase";

export const EmbDatabaseTableColumns =
  (): TableProps<ILogHistory>["columns"] => {
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Operation Date",
        dataIndex: "operation_time",
        key: "operation_time",
        render: (operation_time) =>
          dayjs(operation_time).format("DD-MM-YYYY HH:MM"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <>
            {
              <Tag color={text === "success" ? "green-inverse" : "red-inverse"}>
                {text === "success" ? "Success" : "Failed"}{" "}
              </Tag>
            }
          </>
        ),
      },
      {
        title: "Operation Method",
        dataIndex: "operation_method",
        key: "operation_method",
        render: (text) => (
          <>
            {
              <Tag color={text === "auto" ? "blue" : "purple"}>
                {text === "auto" ? "Auto" : "Manual"}
              </Tag>
            }
          </>
        ),
      },
      {
        title: "Total Add Employee",
        dataIndex: "total_add",
        key: "total_add",
      },
      {
        title: "Total Update Employee",
        dataIndex: "total_update",
        key: "total_update",
      },
      {
        title: "Total Zing Data",
        dataIndex: "get_zing_data",
        key: "get_zing_data",
      },
    ];
  };
