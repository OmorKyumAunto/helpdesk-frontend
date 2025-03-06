import { MenuProps } from "antd";
import { sideBarItems } from "./MenuData";
import { IUser } from "../../auth/types/loginTypes";

type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

function createMenuItems(items: Array<any>): Array<MenuItem> {
  return items.map((item) => {
    if (item) {
      const { label, key, icon, children } = item;
      if (Array.isArray(children)) {
        return getItem(label, key, icon, createMenuItems(children));
      }
      return getItem(label, key, icon);
    }
    return null;
  });
}

export const menuItems = (data?: IUser, roleId?: number) => {
  
  return createMenuItems(sideBarItems(data?.employee_id!,roleId!));
};
