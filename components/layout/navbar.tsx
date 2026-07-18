"use client";

import { ChevronDown, LogOut, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/actions/logout.action";
import Link from "next/link";

type NavbarUser = {
  name: string;
  email: string;
};

export function Navbar({ user }: { user: NavbarUser }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="ml-auto flex items-center gap-1 sm:gap-2">
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link href="/invitation/edit">
          <SquarePen className="h-4 w-4" />
          <span className="hidden sm:inline">Invitation</span>
        </Link>
      </Button>

      <Separator orientation="vertical" className="mx-1 hidden h-6! sm:block" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto items-center gap-2 rounded-full py-1 pl-1 pr-1 sm:pr-2"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-[14ch] truncate text-sm font-medium sm:inline">
              {user.name}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 gap-0.5">
              <p className="truncate text-sm font-medium leading-none">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <form action={logoutAction} className="w-full">
            <DropdownMenuItem variant="destructive" asChild>
              <button type="submit" className="w-full cursor-pointer">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
