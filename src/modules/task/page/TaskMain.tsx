import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import CreateTask from "./CreateTask";
import TaskList from "./TaskList";
import TaskListOther from "./TaskListOther";
import TaskReport from "./TaskReport";
import TaskDashboard from "./TaskDashboard";
import SuperAdminTaskList from "./SuperAdminTaskList";

const TaskMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

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
            children: <TaskDashboard />,
          },
          {
            key: "2",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                All Tasks
              </span>
            ),
            children: <SuperAdminTaskList />,
          },
          // {
          //   key: "3",
          //   label: (
          //     <span style={{ fontSize: "16px", fontWeight: "600" }}>
          //       Reports
          //     </span>
          //   ),
          //   children: <TaskReport />,
          // },
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
            children: <TaskDashboard />,
          },
          {
            key: "5",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Create Task
              </span>
            ),
            children: <CreateTask roleID={roleID} />,
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
            children: <CreateTask />,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <Tabs items={items} />
    </Card>
  );
};

export default TaskMain;
