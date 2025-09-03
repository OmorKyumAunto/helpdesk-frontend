import type { TabsProps } from "antd";
import { Card, Tabs } from "antd";
import React from "react";
import { useGetMeQuery } from "../../../app/api/userApi";
import AdminList from "./Adminlist";
import SuperAdminList from "./SuperAdminList";
import UnitAdmin from "./UnitAdmin";

const onChange = (key: string) => {
  console.log(key);
};

const TicketConfig: React.FC = () => {
  const { data: profile } = useGetMeQuery();
  const roleID = profile?.data?.role_id;

  // Build items dynamically based on role
  let items: TabsProps["items"] = [];

  if (roleID === 4) {
    // Role 4 → Admin List & My Admins
    items = [
      { key: "1", label: "Admin List", children: <AdminList /> },
      { key: "3", label: "My Admins", children: <UnitAdmin /> },
    ];
  } else if (roleID === 1) {
    // Role 1 → Admin List & Super Admin List (My Admins hidden)
    items = [
      { key: "1", label: "Admin List", children: <AdminList /> },
      { key: "2", label: "Super Admin List", children: <SuperAdminList /> },
    ];
  } else {
    // Other roles → All tabs
    items = [
      { key: "1", label: "Admin List", children: <AdminList /> },
      { key: "2", label: "Super Admin List", children: <SuperAdminList /> },
      { key: "3", label: "My Admins", children: <UnitAdmin /> },
    ];
  }

  return (
    <Card>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Card>
  );
};

export default TicketConfig;
