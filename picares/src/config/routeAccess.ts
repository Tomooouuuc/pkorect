import { RouteRule } from "./access";

export const nextjsRoutes: RouteRule[] = [
  // 静态路由
  { nextjsPattern: "/", role: "user" },
  { nextjsPattern: "/admin/user", role: "admin" },
  { nextjsPattern: "/admin/picture", role: "admin" },
  { nextjsPattern: "/admin/categorys", role: "admin" },
  { nextjsPattern: "/admin/tags", role: "admin" },

  { nextjsPattern: "/api/user/query", methods: ["POST"], role: "admin" },
  {
    nextjsPattern: "/api/user/[id]",
    methods: ["PUT", "DELETE"],
    role: "admin",
  },

  { nextjsPattern: "/api/picture/query", methods: ["POST"], role: "admin" },
  { nextjsPattern: "/api/picture/upload", methods: ["POST"], role: "user" },
  {
    nextjsPattern: "/api/picture/[id]",
    methods: ["DELETE", "PUT"],
    role: "admin",
  },

  { nextjsPattern: "/api/categorys", methods: ["GET"], role: "user" },
  { nextjsPattern: "/api/categorys", methods: ["POST"], role: "admin" },
  { nextjsPattern: "/api/categorys/query", methods: ["POST"], role: "admin" },
  {
    nextjsPattern: "/api/categorys/[id]",
    methods: ["DELETE", "PUT"],
    role: "admin",
  },

  { nextjsPattern: "/api/tags", methods: ["GET"], role: "user" },
  { nextjsPattern: "/api/tags", methods: ["POST"], role: "admin" },
  { nextjsPattern: "/api/tags/query", methods: ["POST"], role: "admin" },
  {
    nextjsPattern: "/api/tags/[id]",
    methods: ["DELETE", "PUT"],
    role: "admin",
  },

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
