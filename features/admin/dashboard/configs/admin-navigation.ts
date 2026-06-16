import {
  BarChart3,
  LucideIcon,
  Palette,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

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
