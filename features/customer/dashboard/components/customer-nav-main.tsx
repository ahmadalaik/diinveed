"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CustomerNavItem } from "../configs/customer-navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CustomerNavMain({ items }: { items: CustomerNavItem[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Renders a single nav item at any depth. Calls itself for `children`,
  // switching between top-level and sub components based on `depth`.
  const renderItem = (item: CustomerNavItem, depth = 0): ReactNode => {
    const key = item.href ?? item.title ?? item.label;

    // Section label (top level only)
    if (item.isSection && item.label) {
      return (
        <SidebarGroup key={key} className="p-0 pt-5 first:pt-0">
          <SidebarGroupLabel className="p-0 text-xs font-medium uppercase text-sidebar-foreground">
            {item.label}
          </SidebarGroupLabel>
        </SidebarGroup>
      );
    }

    if (!item.title) return null;

    const isTop = depth === 0;
    const hasChildren = !!item.children?.length;
    const isActive = item.isActive ?? (!!item.href && pathname === item.href);
    const ItemWrapper = isTop ? SidebarMenuItem : SidebarMenuSubItem;
    const ItemButton = isTop ? SidebarMenuButton : SidebarMenuSubButton;

    // Top-level items live in their own group + menu (preserves spacing);
    // nested items render directly inside the parent's SidebarMenuSub.
    const wrap = (node: ReactNode) =>
      isTop ? (
        <SidebarGroup key={key} className="p-0">
          <SidebarMenu>{node}</SidebarMenu>
        </SidebarGroup>
      ) : (
        node
      );

    // Item with children → collapsible
    if (hasChildren) {
      return wrap(
        <Collapsible
          key={isTop ? undefined : key}
          asChild
          defaultOpen={item.isActive}
          className={isTop ? "group/collapsible" : "group/collapsible-sub"}
        >
          <ItemWrapper>
            <CollapsibleTrigger asChild>
              <ItemButton className="rounded-xl text-sm px-3 py-2 h-9 cursor-pointer">
                {item.icon && <item.icon size={16} />}
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto transition-transform duration-200",
                    isTop
                      ? "group-data-[state=open]/collapsible:rotate-90"
                      : "group-data-[state=open]/collapsible-sub:rotate-90",
                  )}
                />
              </ItemButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="me-0 pe-0">
                {item.children!.map((child) => renderItem(child, depth + 1))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </ItemWrapper>
        </Collapsible>,
      );
    }

    // Leaf item → link
    return wrap(
      <ItemWrapper
        key={isTop ? undefined : key}
        className={isTop ? undefined : "w-full"}
      >
        <ItemButton
          asChild
          tooltip={isTop ? item.title : undefined}
          isActive={isTop ? undefined : isActive}
          className={
            isTop
              ? cn(
                  "rounded-lg text-sm px-3 py-2 h-9 cursor-pointer",
                  isActive
                    ? "bg-primary hover:bg-primary dark:bg-blue-500 text-white dark:hover:bg-blue-500 hover:text-white"
                    : "",
                )
              : "w-full"
          }
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false);
            }
          }}
        >
          <Link href={item.href || "#"}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </Link>
        </ItemButton>
      </ItemWrapper>,
    );
  };

  return <>{items.map((item) => renderItem(item))}</>;
}
