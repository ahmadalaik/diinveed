import { BarChart3, LucideIcon, Mail, MessageCircleHeart, Users } from "lucide-react";

export type CustomerNavItem = {
  label?: string;
  isSection?: boolean;
  title?: string;
  icon?: LucideIcon;
  href?: string;
  children?: CustomerNavItem[];
  isActive?: boolean;
};

export const customerNavData: CustomerNavItem[] = [
  { label: "Umum", isSection: true },
  { title: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { title: "Invitation", icon: Mail, href: "/invitation/edit" },
  { title: "Tamu", icon: Users, href: "/tamu" },
  { title: "Ucapan", icon: MessageCircleHeart, href: "/rsvp" },
];
