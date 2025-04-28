import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React, { useState } from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import CreateTask from "./CreateTask";
import SuperAdminTaskList from "./SuperAdminTaskList";
import TaskDashboard from "./TaskDashboard";
import TaskListOther from "./TaskListOther";

const TaskMain: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

  const [activeKey, setActiveKey] = useState(
    roleID === 1 ? "1" : roleID === 2 ? "4" : "6"
  );
  const [taskStatus, setTaskStatus] = useState("");
  const onChange = (key: string) => {
    setActiveKey(key);
    if (key !== "2" && key !== "5") {
      setTaskStatus("");
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
                setTaskStatus={setTaskStatus}
                setActiveKey={setActiveKey}
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
              <SuperAdminTaskList key={activeKey} taskStatus={taskStatus} />
            ),
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
            children: (
              <TaskDashboard
                setTaskStatus={setTaskStatus}
                setActiveKey={setActiveKey}
              />
            ),
          },
          {
            key: "5",
            label: (
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Create Task
              </span>
            ),
            children: (
              <CreateTask
                roleID={roleID}
                key={activeKey}
                taskStatus={taskStatus}
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
    // ...(roleID === 3
    //   ? [
    //       {
    //         key: "6",
    //         label: (
    //           <span style={{ fontSize: "16px", fontWeight: "600" }}>
    //             Create Task
    //           </span>
    //         ),
    //         children: <CreateTask />,
    //       },
    //     ]
    //   : []),
  ];

  return (
    <Card>
      <Tabs activeKey={activeKey} items={items} onChange={onChange} />
    </Card>
  );
};

export default TaskMain;
