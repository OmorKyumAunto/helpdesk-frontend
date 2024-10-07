import { AiOutlinePlusSquare } from "react-icons/ai";
import { FaRegFileAlt, FaRegListAlt } from "react-icons/fa";
import { LiaUsersCogSolid } from "react-icons/lia";
import { LuLayoutDashboard, LuSettings, LuUsers2 } from "react-icons/lu";
import {
  MdListAlt,
  MdOutlineAssignment,
  MdOutlineFactCheck,
  MdWebAsset,
} from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { TbLicense, TbUserHexagon } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";

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
        ]
      : []),

    ...(roleId !== 3
      ? [
          {
            label: <Link to="/ctc/list">CTC</Link>,
            key: "/ctc/list",
            icon: <MdOutlineFactCheck size={20} />,
          },
          {
            label: "SOP",
            key: "sop",
            icon: <FaRegFileAlt size={20} />,
            children: [
              {
                label: (
                  <Link to="/sop/one">SOP1.0.1 ROLES AND RESPONSIBILITIES</Link>
                ),
                key: "/sop/one",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: <Link to="/sop/two">SOP 1.0.2_IT SUPPORT</Link>,
                key: "/sop/two",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/three">
                    SOP 1.0.3_EMAIL USER CREATION AND DEACTIVATION
                  </Link>
                ),
                key: "/sop/three",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: <Link to="/sop/four">SOP 1.0.4_EMAIL ARCHIVING</Link>,
                key: "/sop/four",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/five">
                    SOP 1.0.5 NETWORK AND INFRASTRUCTURE MANAGEMENT
                  </Link>
                ),
                key: "/sop/five",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/six">SOP 1.0.6_FIREWALL CONFIGURATION</Link>
                ),
                key: "/sop/six",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/seven">SOP 1.0.7 NETWORK CONFIGURATION</Link>
                ),
                key: "/sop/seven",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: <Link to="/sop/eight">SOP 1.0.8_CHANGE MANAGEMENT</Link>,
                key: "/sop/eight",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: <Link to="/sop/nine">SOP 1.0.9_INCIDENT RESPONSE</Link>,
                key: "/sop/nine",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/ten">SOP 1.0.10_DATA BACKUP AND RECOVERY</Link>
                ),
                key: "/sop/ten",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/eleven">SOP 1.0.11 IT ACCESS CONTROL</Link>
                ),
                key: "/sop/eleven",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/twelve">SOP 1.0.12_IT ASSET MANAGEMENT</Link>
                ),
                key: "/sop/twelve",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/thirteen">
                    SOP 1.0.13_IT VENDOR MANAGEMENT
                  </Link>
                ),
                key: "/sop/thirteen",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/fourteen">
                    SOP 1.0.14_IT INVENTORY MANAGEMENT
                  </Link>
                ),
                key: "/sop/fourteen",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/fifteen">
                    SOP 1.0.15_IT Procurement (Approved)
                  </Link>
                ),
                key: "/sop/fifteen",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: <Link to="/sop/sixteen">SOP INDEX.pdf</Link>,
                key: "/sop/sixteen",
                icon: <RxHamburgerMenu size={16} />,
              },
              {
                label: (
                  <Link to="/sop/seventeen">SOP Safety & Security.pdf</Link>
                ),
                key: "/sop/seventeen",
                icon: <RxHamburgerMenu size={16} />,
              },
            ],
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
