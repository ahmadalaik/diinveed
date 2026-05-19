import type { UserRole } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";

const roleStyles: Record<UserRole, string> = {
  super_admin:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  user: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge className={roleStyles[role]}>{roleLabels[role]}</Badge>;
}
