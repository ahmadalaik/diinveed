"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { AdminNavMain } from "./admin-nav-main";
import Link from "next/link";
import { buildNavData } from "../configs/admin-navigation";
import type { UserRole } from "@/generated/prisma/enums";

export function AdminSidebar({ role }: { role: UserRole }) {
  return (
    <Sidebar className="py-4 px-0 bg-background" collapsible="icon">
      <div className="flex flex-col gap-6 bg-background h-full">
        <SidebarHeader className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Diinveed</span>
                    <span className="">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="overflow-y-auto gap-0 px-4 group-data-[collapsible=icon]:px-2">
          <AdminNavMain items={buildNavData(role)} />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
