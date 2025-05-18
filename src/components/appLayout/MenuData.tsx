import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaRegFileAlt, FaRegListAlt } from "react-icons/fa";
import { LiaUsersCogSolid } from "react-icons/lia";
import { LuLayoutDashboard, LuSettings, LuUsers2 } from "react-icons/lu";
import {
  MdListAlt,
  MdOutlineAssignment,
  MdOutlineFactCheck,
  MdOutlineLocationOn,
  MdWebAsset,
} from "react-icons/md";
import { TbLicense, TbUserHexagon } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";
import { BsTicketDetailed } from "react-icons/bs";
import { GrConfigure } from "react-icons/gr";
import { GoTasklist } from "react-icons/go";
import { PiTicket } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { TbReport } from "react-icons/tb";
import { MdOutlineSync } from "react-icons/md";

export const sideBarItems = (employee_id: string, roleId: number) => {
  let menuData: IMenuData[] = [
    {
      label: <Link to="/">Dashboard</Link>,
      key: "/",
      icon: <LuLayoutDashboard size={20} />,
    },
    ...(roleId !== 3
      ? [
          {
            label: <Link to="/assets/list">Stock</Link>,
            key: "/assets/list",
            icon: <AiOutlinePlusSquare size={20} />,
          },
          {
            label: <Link to="/assets/distributed">Disbursements</Link>,
            key: "/assets/distributed",
            icon: <MdListAlt size={20} />,
          },
          {
            label: <Link to="/employee/distributed">My Assets</Link>,
            key: "/employee/distributed",
            icon: <MdOutlineAssignment size={20} />,
          },
        ]
      : [
          {
            label: <Link to="/employee/distributed">My Assets</Link>,
            key: "/employee/distributed",
            icon: <MdOutlineAssignment size={20} />,
          },
          {
            label: <Link to="/employee/employee-list">Address Book</Link>,
            key: "/employee/employee-list",
            icon: <LuUsers2 size={20} />,
          },
        ]),
    ...(roleId !== 3
      ? [
          {
            label: <Link to="/employee/list">Address Book</Link>,
            key: "/employee/list",
            icon: <LuUsers2 size={20} />,
          },
        ]
      : []),
      {
        label: <Link to="/reports">Reports</Link>,
        key: "/reports",
        icon: <TbReport size={20} />,
      },
    ...(roleId === 1
      ? [
          {
            label: <Link to="/admin/list">Admin Panel</Link>,
            key: "/admin/list",
            icon: <LiaUsersCogSolid size={20} />,
          },
        ]
      : []),
    ...(roleId !== 3
      ? [
          {
            label: <Link to="/ctc/list">IT CTC</Link>,
            key: "/ctc/list",
            icon: <MdOutlineFactCheck size={20} />,
          },
          {
            label: <Link to="/sop/list">IT SOP</Link>,
            key: "/sop/list",
            icon: <FaRegFileAlt size={20} />,
          },
        ]
      : []),
    ...(employee_id === "15100107"
      ? [
          {
            label: <Link to="/ctc/list">IT CTC</Link>,
            key: "/ctc/list",
            icon: <MdOutlineFactCheck size={20} />,
          },
        ]
      : []),
    {
      label: <Link to="/forms">Templates</Link>,
      key: "/forms",
      icon: <MdWebAsset size={20} />,
    },
    ...(roleId === 1
      ? [
          {
            label: "Settings",
            key: "settings",
            icon: <LuSettings size={20} />,
            children: [
              {
                label: <Link to="/settings/unit">Unit</Link>,
                key: "/settings/unit",
                icon: <FaRegListAlt size={16} />,
              },
              {
                label: <Link to="/settings/location">Sub Unit</Link>,
                key: "/settings/location",
                icon: <MdOutlineLocationOn size={16} />,
              },
              {
                label: <Link to="/settings/license">Licenses</Link>,
                key: "/settings/license",
                icon: <TbLicense size={16} />,
              },
              {
                label: (
                  <Link to="/settings/tickets-config">
                    Ticket Configuration
                  </Link>
                ),
                key: "/settings/tickets-config",
                icon: <GrConfigure size={16} />,
              },
              {
                label: (
                  <Link to="/settings/task-config">Task Configuration</Link>
                ),
                key: "/settings/task-config",
                icon: <GoTasklist size={16} />,
              },
              {
                label: <Link to="/settings/zing-hr-sync">ZingHR Sync</Link>,
                key: "/settings/zing-hr-sync",
                icon: <MdOutlineSync size={16} />,
              },
            ],
          },
        ]
      : []),
    
    {
      label: <Link to="/about">About</Link>,
      key: "/about",
      icon: <TbUserHexagon size={20} />,
    },
  ];
  return menuData;
};
