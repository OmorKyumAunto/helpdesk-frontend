import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";

export const sideBarItems = () => {
  let menuData: IMenuData[] = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "/",
      icon: <DashboardOutlined size={20} />,
    },
    {
      label: <Link to="/assets/list">Assets</Link>,
      key: "/assets/list",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/assets/distributed">Distributed Assets</Link>,
      key: "/assets/distributed",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/employee/list">Employees</Link>,
      key: "/employee/list",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/about">About</Link>,
      key: "/about",
      icon: <UserOutlined />,
    },
  ];
  return menuData;
};
