"use client";

import Link from "next/link";
import { Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "./role-badge";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { canManageUser } from "@/lib/permissions";
import type { UserListItem } from "../types/user.type";
import type { UserRole } from "@/generated/prisma/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableCard } from "@/components/data-table-card";
import { TableEmptyState } from "@/components/table-empty-state";
import type { PageSearchParams } from "@/lib/pagination";

type CurrentUser = { id: string; role: UserRole };

interface UserTableProps {
  users: UserListItem[];
  currentUser: CurrentUser;
  total: number;
  perPage: number;
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
}

export function UserTable({
  users,
  currentUser,
  total,
  perPage,
  page,
  totalPages,
  searchParams,
}: UserTableProps) {
  if (total === 0) {
    return (
      <TableEmptyState
        icon={Users}
        title="Belum ada pengguna"
        description="Tambahkan pengguna untuk mulai mengelola akun di platform."
      />
    );
  }

  return (
    <DataTableCard
      total={total}
      shownCount={users.length}
      noun="pengguna"
      perPage={perPage}
      page={page}
      totalPages={totalPages}
      searchParams={searchParams}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Nama</TableHead>
            <TableHead className="px-4 py-3">Username</TableHead>
            <TableHead className="px-4 py-3">Peran</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const canManage = canManageUser(currentUser, user);
            return (
              <TableRow key={user.id} className="group">
                <TableCell className="px-4 py-3 font-medium">{user.name}</TableCell>
                                <TableCell className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Lihat</span>
                      </Link>
                    </Button>
                    {canManage && (
                      <>
                        <EditUserDialog user={user} actorRole={currentUser.role} />
                        <DeleteUserDialog userId={user.id} userName={user.name} />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DataTableCard>
  );
}
