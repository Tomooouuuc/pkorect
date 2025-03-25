import { MenuDataItem } from "@ant-design/pro-components";
import { getUserLevel } from "./access";
import { roleLevels, UserRole } from "./userRole";

const menus: MenuDataItem[] = [
  {
    path: "/admin/user",
    name: "用户管理",
    access: roleLevels.admin,
  },
  {
    path: "/admin/picture",
    name: "图片管理",
    access: roleLevels.admin,
  },
  {
    path: "/admin/categorys",
    name: "目录管理",
    access: roleLevels.admin,
  },
  {
    path: "/admin/tags",
    name: "标签管理",
    access: roleLevels.admin,
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
