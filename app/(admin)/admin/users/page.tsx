import prisma from "@/lib/prisma";
import { UserTable } from "@/features/user/components/user-table";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { getManagedRoles } from "@/lib/permissions";
import type { UserListItem } from "@/features/user/types/user.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getPagination, getTotalPages, type PageSearchParams } from "@/lib/pagination";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const actor = await adminIsRequired();
  const sp = await searchParams;
  const { page, perPage, skip, take } = getPagination(sp);

  const where = {
    deletedAt: null,
    role: { in: getManagedRoles(actor.role) },
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        image: true,
        createdAt: true,
        deletedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = getTotalPages(total, perPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengguna"
        actions={
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Link>
          </Button>
        }
      />
      <UserTable
        users={users as UserListItem[]}
        currentUser={actor}
        total={total}
        perPage={perPage}
        page={page}
        totalPages={totalPages}
        searchParams={sp}
      />
    </div>
  );
}
