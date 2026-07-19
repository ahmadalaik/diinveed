"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { CustomerNavMain } from "./customer-nav-main";
import { customerNavData } from "../configs/customer-navigation";

import { ComponentProps } from "react";

export function CustomerSidebar(props: ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar className="py-4 px-0 bg-background" collapsible="icon" {...props}>
      <div className="flex flex-col gap-6 bg-background h-full">
        <SidebarHeader className="py-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false);
                  }
                }}
              >
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
          <CustomerNavMain items={customerNavData} />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
