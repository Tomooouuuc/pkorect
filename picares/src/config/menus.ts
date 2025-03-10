import { MenuDataItem } from "@ant-design/pro-components";
import { getUserLevel } from "./access";
import { roleLevels, UserRole } from "./userRole";

export const menus: MenuDataItem[] = [
  {
    path: "/",
    name: "主页",
  },
  {
    path: "/user/login",
    name: "登录",
    access: roleLevels.admin,
  },
  {
    path: "/user/register",
    name: "注册",
    access: roleLevels.admin,
  },
  {
    name: "管理",
    access: roleLevels.admin,
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
        access: roleLevels.admin,
      },
    ],
  },
];

export const getAccessMenus = (role?: string) => {
  const userLevel = getUserLevel(role as UserRole);

  const getMenus = (menuItem = menus) => {
    return menuItem.filter((item) => {
      if (userLevel < item.access) {
        return false;
      }
      if (item.children) {
        item.children = getMenus(item.children);
      }
      return true;
    });
  };
  return getMenus();
};
