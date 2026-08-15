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
import { TbLicense, TbUserHexagon, TbMessage } from "react-icons/tb";
import { Link } from "react-router-dom";
import { IMenuData } from "../../../Types/MenuData";
import { BsTicketDetailed } from "react-icons/bs";
import { GrConfigure } from "react-icons/gr";
import { TfiAnnouncement } from "react-icons/tfi";
import { GoTasklist } from "react-icons/go";
import { PiTicket } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { TbReport } from "react-icons/tb";
import { MdOutlineSync, MdOutlineTimer, MdOutlineDeleteSweep, MdOutlineBuild } from "react-icons/md";
import { HiBuildingLibrary } from "react-icons/hi2";

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
          label: <Link to="/assets/disposed">Dispose</Link>,
          key: "/assets/disposed",
          icon: <MdOutlineDeleteSweep size={20} />,
        },
        {
          label: <Link to="/assets/support">On Support</Link>,
          key: "/assets/support",
          icon: <MdOutlineTimer size={20} />,
        },
        {
          label: <Link to="/assets/under-repair">Under Repair</Link>,
          key: "/assets/under-repair",
          icon: <MdOutlineBuild size={20} />,
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
        {
          label: <Link to="/reports">Reports</Link>,
          key: "/reports",
          icon: <TbReport size={20} />,
        },
      ]
      : []),

      ...(roleId === 1 || roleId === 4
              ? [
                {
                  label: (
                    <Link to="/announcements">
                      Announcements
                    </Link>
                  ),
                  key: "/announcements",
                  icon: <TfiAnnouncement size={20} />,
                },
                
              ]
              : []),
    ...(roleId === 1 || roleId === 4
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
    ...(roleId === 1 || roleId === 4
      ? [
        {
          label: "Settings",
          key: "settings",
          icon: <LuSettings size={20} />,
          children: [


            // Only for roleId 1
            ...(roleId === 1
              ? [
                {
                  label: <Link to="/settings/unit">Unit</Link>,
                  key: "/settings/unit",
                  icon: <FaRegListAlt size={16} />,
                },
              ]
              : []),
            // Sub Unit: Super Admin (1) and Unit Super Admin (4)
            ...(roleId === 1 || roleId === 4
              ? [
                {
                  label: <Link to="/settings/location">Sub Unit</Link>,
                  key: "/settings/location",
                  icon: <MdOutlineLocationOn size={16} />,
                },
              ]
              : []),
            // Common for both roleId 1 & 4
            ...(roleId === 4
              ? [
                {
                  label: (
                    <Link to="/settings/complex-config">
                      Complex Configure
                    </Link>
                  ),
                  key: "/settings/complex-config",
                  icon: <HiBuildingLibrary size={16} />,
                },
                
              ]
              : []),

            // Only for roleId 1
            ...(roleId === 1
              ? [
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
                    <Link to="/settings/task-config">
                      Task Configuration
                    </Link>
                  ),
                  key: "/settings/task-config",
                  icon: <GoTasklist size={16} />,
                },

                {
                  label: <Link to="/settings/license">Licenses</Link>,
                  key: "/settings/license",
                  icon: <TbLicense size={16} />,
                },
                {
                  label: (
                    <Link to="/settings/zing-hr-sync">ZingHR Sync</Link>
                  ),
                  key: "/settings/zing-hr-sync",
                  icon: <MdOutlineSync size={16} />,
                },
                ...(roleId === 1
                  ? [
                      {
                        label: (
                          <Link to="/settings/backup">Database Backup</Link>
                        ),
                        key: "/settings/backup",
                        icon: <MdOutlineSync size={16} />,
                      },
                    ]
                  : []),
              ]
              : []),
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

/**
 * The set of route paths a given user is actually allowed to open — derived
 * from the SAME role logic that builds their menu, so navigation access can
 * never drift from what the sidebar shows. Used to guard direct-URL access
 * (typing /assets/list) for roles that don't have the menu item.
 */
export const allowedRoutesForUser = (
  employee_id: string,
  roleId: number
): Set<string> => {
  const keys = new Set<string>();
  const walk = (nodes: any[]) => {
    (nodes || []).forEach((n) => {
      if (!n) return;
      if (typeof n.key === "string" && n.key.startsWith("/")) keys.add(n.key);
      if (Array.isArray(n.children)) walk(n.children);
    });
  };
  walk(sideBarItems(employee_id, roleId) as any[]);

  // Always reachable for any authenticated user, regardless of the menu.
  keys.add("/");
  keys.add("/setting/profile");

  // Header quick-action routes (not in the sidebar) — mirror AppLayout's
  // `quickActions` show conditions so the guard matches those buttons.
  if (employee_id !== "Assetteam") keys.add("/tickets/list");
  if (roleId !== 3 && employee_id !== "Assetteam") keys.add("/task/list");

  // Sub-routes not shown as their own menu item, gated by a parent permission.
  if (keys.has("/reports")) keys.add("/combine-report");
  if (keys.has("/announcements")) keys.add("/announcements/create");

  return keys;
};
