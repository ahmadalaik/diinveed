import type { UserRole } from "@/generated/prisma/enums";

export type { UserRole };
export type AdminRole = Extract<UserRole, "admin" | "super_admin">;

export function isAdminRole(role: string): role is AdminRole {
  return role === "admin" || role === "super_admin";
}

export function homeRouteForRole(role: UserRole): string {
  return isAdminRole(role) ? "/admin/dashboard" : "/dashboard";
}
