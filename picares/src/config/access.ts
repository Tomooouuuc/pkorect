import { nextjsRoutes } from "./routeAccess";
import { Level, roleLevels, UserRole } from "./userRole";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export interface RouteRule {
  nextjsPattern: string;
  methods?: HttpMethod[];
  role: UserRole;
}

export const DEFAULT_ROLE: UserRole = "";

function nextjsPatternToRegex(pattern: string): RegExp {
  if (pattern.includes("[...")) {
    const base = pattern
      .replace(/\[\.\.\.\w+\]/g, "(.*)")
      .replace(/\//g, "\\/");
    return new RegExp(`^${base}(\\/.*)?$`);
  }

  const regexString = pattern
    .split("/")
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const paramName = segment.slice(1, -1); // 提取参数名
        return paramName === "index" ? "(index)?" : "([^/]+)";
      }
      return segment;
    })
    .join("/");
  return new RegExp(`^${regexString}$`);
}

interface CompiledRoute {
  regex: RegExp;
  methods?: HttpMethod[];
  role: UserRole;
}

const compiledRoutes: CompiledRoute[] = nextjsRoutes.map((route) => ({
  regex: nextjsPatternToRegex(route.nextjsPattern),
  methods: route.methods?.map((m) => m.toUpperCase()) as HttpMethod[],
  role: route.role,
}));

export function matchNextjsRoute(
  pathname: string,
  method?: HttpMethod
): UserRole {
  const cleanPath = pathname.split(/[?#]/)[0]?.replace(/\/$/, "") || "/";

  const candidates = compiledRoutes.filter((route) =>
    route.regex.test(cleanPath)
  );
  if (!candidates.length) return DEFAULT_ROLE;

  if (method) {
    const methodMatch = candidates.find(
      (route) => !route.methods || route.methods.includes(method)
    );
    if (methodMatch) return methodMatch.role;
  }

  const fallbackMatch = candidates.find((route) => !route.methods);
  return fallbackMatch?.role || DEFAULT_ROLE;
}

export function getAuthLevel(pathname: string, method?: string): Level {
  const role = matchNextjsRoute(pathname, method?.toUpperCase() as HttpMethod);
  return roleLevels[role];
}

export function getUserLevel(user: UserRole): Level {
  return roleLevels[user] ?? 0;
}
