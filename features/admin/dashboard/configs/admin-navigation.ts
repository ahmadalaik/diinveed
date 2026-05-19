import { BarChart3, LucideIcon, Settings, Users } from "lucide-react";

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
  { label: "General", isSection: true },
  { title: "Dashboard", icon: BarChart3, href: "/admin/dashboard" },
  { title: "Users", icon: Users, href: "/admin/users" },

  // Apps Section
  { label: "Other", isSection: true },
  {
    title: "Settings",
    icon: Settings,
    children: [{ title: "Profile", href: "#" }],
  },
];
