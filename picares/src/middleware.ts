// middleware.ts
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 获取请求路径
  const path = request.nextUrl.pathname;

  // 测试middleware是否生效。这里没有打印出路径
  console.log("路径是：", path);
}
