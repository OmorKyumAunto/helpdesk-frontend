import React from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import RaiseTicketForm from "./RaiseTicket";
import { useGetMeQuery } from "../../../app/api/userApi";
import RaiseTicketList from "./RaiseTicketList";
import SuperAdminTicketList from "./SuperAdminTicketList";
import AdminTicketList from "./AdminTicketList";
import TicketDashboard from "./TicketDashboard";
import TicketReport from "./TicketReport";

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
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>Dashboard</span>,
            children: <TicketDashboard />,
          },
          {
            key: "2",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>All Tickets</span>,
            children: <SuperAdminTicketList />,
          },
          {
            key: "3",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>Reports</span>,
            children: <TicketReport />,
          },
        ]
      : []),
    ...(roleID === 2
      ? [
          {
            key: "4",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>Dashboard</span>,
            children: <TicketDashboard />,
          },
          {
            key: "5",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>My Tickets</span>,
            children: <AdminTicketList />,
          },
        ]
      : []),
    ...(roleID === 3
      ? [
          {
            key: "6",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>Raise a Ticket</span>,
            children: <RaiseTicketForm />,
          },
          {
            key: "7",
            label: <span style={{ fontSize: "16px", fontWeight: "600" }}>My Tickets</span>,
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
