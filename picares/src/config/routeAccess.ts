import { RouteRule } from "./access";

export const nextjsRoutes: RouteRule[] = [
  // 静态路由
  { nextjsPattern: "/", role: "user" },
  { nextjsPattern: "/admin/user", role: "admin" },

  { nextjsPattern: "/api/user", role: "admin" },
  //   // 动态路由
  //   { nextjsPattern: "/user/[id]", role: "user" },
  //   { nextjsPattern: "/posts/[slug]", role: "guest" },

  // 通配路由（必须放在最后）
  // 为什么这个要放在最后？
  //   { nextjsPattern: "/posts/[...slug]", role: "guest" },
  //   {
  //     nextjsPattern: "/api/auth/nextauth",
  //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  //     role: "user",
  //   },
  //   {
  //     nextjsPattern: "/api/auth/[nextauth]",
  //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  //     role: "admin",
  //   },
  //   {
  //     nextjsPattern: "/api/[...nextauth]",
  //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  //     role: "guest",
  //   },
];
