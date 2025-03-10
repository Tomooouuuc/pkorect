// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getAuthLevel, getUserLevel } from "./config/access";
import { UserRole } from "./config/userRole";

export async function middleware(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/_next")) {
    const token = await getToken({ req: request });

    const userRole = token?.user?.userRole as UserRole;
    const userLevel = getUserLevel(userRole);

    if (pathname.startsWith("/api")) {
      const method = request.method;
      const pathLevel = getAuthLevel(pathname, method);
      console.log(
        "pathname",
        pathname,
        "userLevel",
        userLevel,
        "pathLevel",
        pathLevel,
        "userLevel<pathLevel",
        userLevel < pathLevel
      );

      if (userLevel < pathLevel) {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      } else {
        return NextResponse.next();
      }
    }

    const pathLevel = getAuthLevel(pathname);
    if (userLevel < pathLevel) {
      if (userLevel === 0) {
        return NextResponse.redirect(new URL("/user/login", request.url));
      }
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }
  return NextResponse.next();
}
