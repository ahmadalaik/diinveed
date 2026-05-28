import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    <div className="ml-auto flex items-center gap-3">
      <Link
        href="/invitation/edit"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Invitation
      </Link>
      <div className="text-right">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="icon">
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </form>
    </div>
  );
}
