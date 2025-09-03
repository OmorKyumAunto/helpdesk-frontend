import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React from "react";
import CategoryList from "../../Category/pages/CategoryList";
import AssignCategoryList from "../../assignCategory/pages/AssignCategoryList";
import SLAConfigure from "../../SLAConfigure/pages/SLAConfigurePage";
import ComplexList from "./ComplexList";
import CreateComplexLocation from "./ComplexLocationList";

const onChange = (key: string) => {
  console.log(key);
};

const TicketConfig: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Create Complex",
      children: <ComplexList />,
    },
    {
      key: "2",
      label: "Create Complex Location",
      children: <CreateComplexLocation />,
    },
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default TicketConfig;
