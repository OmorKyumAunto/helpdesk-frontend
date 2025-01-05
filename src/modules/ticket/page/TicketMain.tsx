import React, { useState } from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import RaiseTicketForm from "./RaiseTicket";
import { useGetMeQuery } from "../../../app/api/userApi";
import RaiseTicketList from "./RaiseTicketList";
import SuperAdminTicketList from "./SuperAdminTicketList";
import AdminTicketList from "./AdminTicketList";
import TicketDashboard from "./TicketDashboard";
import TicketReport from "./TicketReport";

const TicketMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

  const [activeKey, setActiveKey] = useState(
    roleID === 1 ? "1" : roleID === 2 ? "4" : "6"
  );
  const [ticketValue, setTicketValue] = useState("");
  const [ticketPriorityValue, setTicketPriorityValue] = useState("");

  const onChange = (key: string) => {
    setActiveKey(key);
    if (key === "1" || key === "4") {
      window.location.reload();
    }
  };

  const items: TabsProps["items"] = [
    ...(roleID === 1
      ? [
          {
            key: "1",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Dashboard
              </span>
            ),
            children: (
              <TicketDashboard
                setActiveKey={setActiveKey}
                roleID={roleID}
                setTicketValue={setTicketValue}
                setTicketPriorityValue={setTicketPriorityValue}
              />
            ),
          },
          {
            key: "2",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                All Tickets
              </span>
            ),
            children: (
              <SuperAdminTicketList
                // ticketPriorityValue={ticketPriorityValue}
                ticketValue={ticketValue}
              />
            ),
          },
          {
            key: "3",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Reports
              </span>
            ),
            children: <TicketReport />,
          },
        ]
      : []),
    ...(roleID === 2
      ? [
          {
            key: "4",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Dashboard
              </span>
            ),
            children: (
              <TicketDashboard
                setActiveKey={setActiveKey}
                roleID={roleID}
                setTicketValue={setTicketValue}
                setTicketPriorityValue={setTicketPriorityValue}
              />
            ),
          },
          {
            key: "5",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                My Tickets
              </span>
            ),
            children: <AdminTicketList ticketValue={ticketValue} />,
          },
        ]
      : []),
    ...(roleID === 3
      ? [
          {
            key: "6",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Raise a Ticket
              </span>
            ),
            children: <RaiseTicketForm />,
          },
          {
            key: "7",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                My Tickets
              </span>
            ),
            children: <RaiseTicketList />,
          },
        ]
      : []),
  ];
  return (
    <Card>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </Card>
  );
};

export default TicketMain;
