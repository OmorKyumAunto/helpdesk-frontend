import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React from "react";
import TaskCategoryList from "./TaskCategoryList";
import TaskSubCategoryList from "./TaskSubCategoryList";

const onChange = (key: string) => {
  console.log(key);
};

const TaskConfiguration: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Task Category",
      children: <TaskCategoryList />,
    },
    {
      key: "2",
      label: "Task Sub Category",
      children: <TaskSubCategoryList />,
    },
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default TaskConfiguration;
