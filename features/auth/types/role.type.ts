export const USER_ROLES = ["user", "admin", "super_admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_ROLES = ["admin", "super_admin"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(role: string): role is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}

export function homeRouteForRole(role: UserRole) {
  return isAdminRole(role) ? "/admin/dashboard" : "/dashboard";
}
