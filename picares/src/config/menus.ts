import { MenuDataItem } from "@ant-design/pro-components";

export const menus: MenuDataItem[] = [
  {
    path: "/",
    name: "主页",
  },
  {
    name: "管理",
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
      },
    ],
  },
];
