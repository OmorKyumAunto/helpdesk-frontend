import React, { useState } from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import RaiseTicketForm from "./RaiseTicket";
import { useGetMeQuery } from "../../../app/api/userApi";
import RaiseTicketList from "./RaiseTicketList";
import SuperAdminTicketList from "./SuperAdminTicketList";
import AdminSolvedTicketList from "./AdminSolvedTicketList";
import AdminPendingTicketList from "./AdminPendingTicketList";
import TicketDashboard from "./TicketDashboard";
import TicketReport from "./TicketReport";
import OnBehalfTicket from "./OnBehalfTicket";
import UnitSuperAdminPendingTicketList from "./UnitSuperAdminPendingTicketList";
import UnitSuperAdminSolvedTicketList from "./UnitSuperAdminSolvedTicketList";
const TicketMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

  const [activeKey, setActiveKey] = useState(
    roleID === 1 ? "1" : roleID === 2 ? "4" : roleID === 4 ? "11" : "6"
  );
  const [ticketValue, setTicketValue] = useState("");
  const [ticketPriorityValue, setTicketPriorityValue] = useState("");
  const [ticketSolver, setTicketSolver] = useState("");
  const onChange = (key: string) => {
    setActiveKey(key);
    if (key !== "2" && key !== "5") {
      setTicketValue("");
      setTicketPriorityValue("");
    }
    if (key !== "3") {
      setTicketSolver("");
    }
    if (key !== "4") {
      setTicketSolver("");
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
              setTicketSolver={setTicketSolver}
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
              key={activeKey}
              ticketPriorityValue={ticketPriorityValue}
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
          children: (
            <TicketReport key={activeKey} ticketSolver={ticketSolver} />
          ),
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
          key: "10",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Pending Tickets
            </span>
          ),
          children: (
            <AdminPendingTicketList
              key={activeKey}
              ticketPriorityValue={ticketPriorityValue}
              ticketValue={ticketValue}
            />
          ),
        },
        {
          key: "5",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Solved Tickets
            </span>
          ),
          children: (
            <AdminSolvedTicketList
              key={activeKey}
              ticketPriorityValue={ticketPriorityValue}
              ticketValue={ticketValue}
            />
          ),
        },
        {
          key: "8",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              On Behalf Ticket
            </span>
          ),
          children: <OnBehalfTicket setActiveKey={setActiveKey} />,
        },
        {
          key: "9",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Reports
            </span>
          ),
          children: (
            <TicketReport key={activeKey} ticketSolver={ticketSolver} />
          ),
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
          children: <RaiseTicketForm setActiveKey={setActiveKey} />,
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
    ...(roleID === 4
      ? [
        {
          key: "11",
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
              setTicketSolver={setTicketSolver}
            />
          ),
        },
        {
          key: "12",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Pending Tickets
            </span>
          ),
          children: (
            <UnitSuperAdminPendingTicketList
              key={activeKey}
              ticketPriorityValue={ticketPriorityValue}
              ticketValue={ticketValue}
            />
          ),
        },
        {
          key: "13",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Solved Tickets
            </span>
          ),
          children: (
            <UnitSuperAdminSolvedTicketList
              key={activeKey}
              ticketPriorityValue={ticketPriorityValue}
              ticketValue={ticketValue}
            />
          ),
        },

        {
          key: "14",
          label: (
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Reports
            </span>
          ),
          children: (
            <TicketReport key={activeKey} ticketSolver={ticketSolver} />
          ),
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
