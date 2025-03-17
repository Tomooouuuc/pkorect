export type UserRole = "admin" | "user" | "ban";
export type Level = 0 | 1 | 2;

export const roleLevels: Record<UserRole, Level> = {
  admin: 2,
  user: 1,
  ban: 0,
};
