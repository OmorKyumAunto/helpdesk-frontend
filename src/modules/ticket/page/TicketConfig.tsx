import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React from "react";
import CategoryList from "../../Category/pages/CategoryList";
import AssignCategoryList from "../../assignCategory/pages/AssignCategoryList";
import SLAConfigure from "../../SLAConfigure/pages/SLAConfigurePage";

const onChange = (key: string) => {
  console.log(key);
};

const TicketConfig: React.FC = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Categories",
      children: <CategoryList />,
    },
    {
      key: "2",
      label: "Assign Category",
      children: <AssignCategoryList />,
    },
    {key:"3",
      label:"SLA Configure",
      children:<SLAConfigure />,
    },
  ];
  return (
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default TicketConfig;
