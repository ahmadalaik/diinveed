"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { buildPageHref, type PageSearchParams } from "@/lib/pagination";

type GuestTabsProps = React.ComponentProps<typeof Tabs> & {
  searchParams: PageSearchParams;
};

export function GuestTabs({ searchParams, ...props }: GuestTabsProps) {
  const router = useRouter();

  const handleValueChange = (newValue: string) => {
    const newHref = buildPageHref(
      { ...searchParams, tab: newValue === "guests" ? undefined : newValue },
      1,
      "page"
    );
    router.push(newHref);
    if (props.onValueChange) {
      props.onValueChange(newValue);
    }
  };

  return <Tabs {...props} onValueChange={handleValueChange} />;
}
