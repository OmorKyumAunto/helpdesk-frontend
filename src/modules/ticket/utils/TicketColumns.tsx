import { TableProps } from "antd/lib";
import { IRaiseTicketList } from "../types/ticketTypes";
import { Tag } from "antd";

export const RaiseTicketTableColumn =
  (): TableProps<IRaiseTicketList>["columns"] => {
    return [
      {
        title: "Serial No",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Asset Name",
        dataIndex: "asset_name",
        key: "asset_name",
      },
      {
        title: "Asset Category",
        dataIndex: "asset_category",
        key: "asset_category",
      },
      {
        title: "Unit",
        dataIndex: "unit_name",
        key: "unit_name",
      },
      {
        title: "Category",
        dataIndex: "category_name",
        key: "category_name",
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
        render: (text) => (
          <>
            {text === "high" && <Tag color="red">HIGH</Tag>}
            {text === "medium" && <Tag color="warning">MEDIUM</Tag>}
            {text === "low" && <Tag color="success">LOW</Tag>}
          </>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <>
            {text === 1 && <Tag color="green-inverse">ACTIVE</Tag>}
            {text === 0 && <Tag color="red-inverse">INACTIVE</Tag>}
          </>
        ),
      },
    ];
  };
