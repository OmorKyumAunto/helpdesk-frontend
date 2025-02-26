import React, { useState } from "react";
import { Card, Tabs } from "antd";
import type { TabsProps } from "antd";
import CreateTask from "./CreateTask";
import { useGetMeQuery } from "../../../app/api/userApi";
import TaskList from "./TaskList";
import TaskListOther from "./TaskListOther";
import AssignTask from "./AssignTask";
import TaskDashboard from "./TaskDashboard";
import TaskReport from "./TaskReport";

const TaskMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

  const [activeKey, setActiveKey] = useState(
    roleID === 1 ? "1" : roleID === 2 ? "4" : "6"
  );
  const [ticketValue, setTicketValue] = useState("");
  const [ticketPriorityValue, setTicketPriorityValue] = useState("");
  const [ticketSolver, setTicketSolver] = useState("");
  console.log({ ticketValue });
  const onChange = (key: string) => {
    setActiveKey(key);
    if (key !== "2" && key !== "5") {
      setTicketValue("");
      setTicketPriorityValue("");
    }
    if (key !== "3") {
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
              <TaskDashboard
                
              />
            ),
          },
          {
            key: "2",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                All Tasks
              </span>
            ),
            children: (
              <TaskList
                
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
              <TaskReport />
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
                
              </span>
            ),
            children: (
              <TaskDashboard
                
              />
            ),
          },
          {
            key: "5",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                My Tasks
              </span>
            ),
            children: (
              <TaskList
               
              />
            ),
          },
          {
            key: "8",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Others Task
              </span>
            ),
            children: <TaskListOther />,
          },
        ]
      : []),
    ...(roleID === 3
      ? [
          {
            key: "6",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Create Task
              </span>
            ),
            children: <CreateTask/>,
          },
          {
            key: "7",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                My Tasks
              </span>
            ),
            children: <TaskList />,
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

export default TaskMain;
