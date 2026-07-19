import {
  BarChart3,
  LucideIcon,
  Palette,
  Receipt,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import type { UserRole } from "@/generated/prisma/enums";

export type NavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: NavItem[];
  isActive?: boolean;
};

export const navData: NavItem[] = [
  // Dashboards Section
  { label: "Umum", isSection: true },
  { title: "Dashboard", icon: BarChart3, href: "/admin/dashboard" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Templates", icon: Palette, href: "/admin/templates" },
  { title: "Transaksi", icon: Receipt, href: "/admin/transactions" },

  // Apps Section
  { label: "Other", isSection: true },
  {
    title: "Pengaturan",
    icon: Settings,
    children: [{ title: "Profile", href: "#" }],
  },
];

export function buildNavData(role: UserRole): NavItem[] {
  const items: NavItem[] = [
    // Dashboards Section
    { label: "Umum", isSection: true },
    { title: "Dashboard", icon: BarChart3, href: "/admin/dashboard" },
    { title: "Users", icon: Users, href: "/admin/users" },
    { title: "Templates", icon: Palette, href: "/admin/templates" },
    { title: "Transaksi", icon: Receipt, href: "/admin/transactions" },
  ];

  if (role === "super_admin") {
    items.push({
      title: "Audit Log",
      icon: ScrollText,
      href: "/admin/audit-logs",
    });
  }

  items.push(
    // Apps Section
    { label: "Other", isSection: true },
    {
      title: "Pengaturan",
      icon: Settings,
      children: [{ title: "Profile", href: "#" }],
    }
  );

  return items;
}
