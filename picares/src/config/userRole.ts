export type UserRole = "admin" | "user" | "guest";
export type Level = 0 | 1 | 2;

export const roleLevels: Record<UserRole, Level> = {
  admin: 2,
  user: 1,
  guest: 0,
};
