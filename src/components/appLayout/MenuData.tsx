import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import { TbUserHexagon } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineAssignment } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { MdWebAsset } from "react-icons/md";

import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";

export const sideBarItems = () => {
  let menuData: IMenuData[] = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "/",
      icon: <LuLayoutDashboard size={20} />,
    },
    {
      label: <Link to="/assets/list">Assets</Link>,
      key: "/assets/list",
      icon: <AiOutlinePlusSquare size={20} />,
    },
    {
      label: <Link to="/assets/distributed">Distributed Assets</Link>,
      key: "/assets/distributed",
      icon: <MdOutlineAssignment size={20} />,
    },
    {
      label: <Link to="/employee/list">Employees</Link>,
      key: "/employee/list",
      icon: <LuUsers2 size={20} />,
    },
    {
      label: <Link to="/forms">Forms</Link>,
      key: "/forms",
      icon: <MdWebAsset size={20} />,
    },
    {
      label: <Link to="/about">About</Link>,
      key: "/about",
      icon: <TbUserHexagon size={20} />,
    },
  ];
  return menuData;
};
