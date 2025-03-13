export type UserRole = "admin" | "user" | "";
export type Level = 0 | 1 | 2;

export const roleLevels: Record<UserRole, Level> = {
  admin: 2,
  user: 1,
  "": 0,
};
