import { TbUserHexagon } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { MdOutlineAssignment } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { MdWebAsset } from "react-icons/md";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";
import { FaRegListAlt } from "react-icons/fa";
import { LiaUsersCogSolid } from "react-icons/lia";

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
            icon: <MdOutlineAssignment size={20} />,
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
        ]
      : []),
    ...(roleId === 1
      ? [
          {
            label: <Link to="/unit/list">Unit Setting</Link>,
            key: "/unit/list",
            icon: <FaRegListAlt size={16} />,
          },
        ]
      : []),
    {
      label: <Link to="/forms">Templates</Link>,
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
