import prisma from "@/lib/prisma";
import { UserTable } from "@/features/user/components/user-table";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { getManagedRoles } from "@/lib/permissions";
import type { UserListItem } from "@/features/user/types/user.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const actor = await adminIsRequired();

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      role: { in: getManagedRoles(actor.role) },
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      createdAt: true,
      deletedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        {/* <CreateUserDialog actorRole={actor.role} /> */}
        <Button asChild>
          <Link href="/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      <UserTable users={users as UserListItem[]} currentUser={actor} />
    </div>
  );
}
