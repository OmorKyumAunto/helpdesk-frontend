import React from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import RaiseTicketForm from "./RaiseTicket";
import { DashboardOutlined } from "@ant-design/icons";
import { useGetMeQuery } from "../../../app/api/userApi";
import RaiseTicketList from "./RaiseTicketList";
import SuperAdminTicketList from "./SuperAdminTicketList";
import AdminTicketList from "./AdminTicketList";

const onChange = (key: string) => {
  console.log(key);
};

const TicketMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;
  const items: TabsProps["items"] = [
    ...(roleID === 1
      ? [
          {
            key: "1",
            label: "Dashboard",
            children: "super admin dashboard",
            icon: <DashboardOutlined />,
          },
          {
            key: "2",
            label: "All Tickets",
            children: <SuperAdminTicketList />,
          },
          {
            key: "3",
            label: "Reports",
            children: "reports content",
          },
        ]
      : []),
    ...(roleID === 2
      ? [
          {
            key: "4",
            label: "Dashboard",
            children: "dashboard Admin",
          },
          {
            key: "5",
            label: "Ticket",
            children: <AdminTicketList />,
          },
        ]
      : []),
    ...(roleID === 3
      ? [
          {
            key: "6",
            label: "Raise A Ticket",
            children: <RaiseTicketForm />,
          },
          {
            key: "7",
            label: "Tickets",
            children: <RaiseTicketList />,
          },
        ]
      : []),
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default TicketMain;
