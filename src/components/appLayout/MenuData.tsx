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

export const sideBarItems = (roleId: number) => {
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
    ...(roleId === 1
      ? [
          {
            label: <Link to="/admin/list">Admin Panel</Link>,
            key: "/admin/list",
            icon: <LiaUsersCogSolid size={20} />,
          },
          {
            label: "Tickets",
            key: "tickets",
            icon: <BsTicketDetailed size={20} />,
            children: [
              {
                label: <Link to="/tickets/ticket-list">Test</Link>,
                key: "/tickets/ticket-list",
                icon: <FaRegListAlt size={16} />,
              },
              {
                label: "configuration",
                key: "tickets/configuration",
                icon: <GrConfigure size={20} />,
                children: [
                  {
                    label: <Link to="/tickets/category">Category</Link>,
                    key: "/tickets/category",
                    icon: <FaRegListAlt size={16} />,
                  },
                ],
              },
            ],
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
