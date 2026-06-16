import { UserRole } from "@/types/role.type";

export const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];
