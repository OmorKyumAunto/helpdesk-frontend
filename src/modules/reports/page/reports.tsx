import React, { useState } from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import TicketReport from "../../ticket/page/TicketReport";
import AssetReport from "../components/AssetReport";
import TaskReport from "../components/TaskReport";
import TicketAndTaskCombineReport from "../components/TicketAndTaskCombineReport";

const ReportsPage: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span style={{ fontSize: "16px", fontWeight: "600" }}>
          Asset Report
        </span>
      ),
      children: <AssetReport />,
    },
    {
      key: "2",
      label: (
        <span style={{ fontSize: "16px", fontWeight: "600" }}>Task Report</span>
      ),
      children: <TaskReport />,
    },
    {
      key: "3",
      label: (
        <span style={{ fontSize: "16px", fontWeight: "600" }}>
          Ticket Report
        </span>
      ),
      children: <TicketReport />,
    },
    {
      key: "4",
      label: (
        <span style={{ fontSize: "16px", fontWeight: "600" }}>
          Ticket & Task Combine Report
        </span>
      ),
      children: <TicketAndTaskCombineReport />,
    },
  ];

  return (
    <Card>
      <Tabs items={items} />
    </Card>
  );
};

export default ReportsPage;
