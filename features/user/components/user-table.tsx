"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type CurrentUser = { id: string; role: UserRole };

interface UserTableProps {
  users: UserListItem[];
  currentUser: CurrentUser;
}

export function UserTable({ users, currentUser }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        No users found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5">
              <TableHead className="px-4 py-3">Name</TableHead>
              <TableHead className="px-4 py-3">Username</TableHead>
              <TableHead className="px-4 py-3">Role</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const canManage = canManageUser(currentUser, user);
              return (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-3 font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-3">{user.username}</TableCell>
                  <TableCell className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={
                        user.status === "active"
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      {canManage && (
                        <>
                          <EditUserDialog user={user} />
                          <DeleteUserDialog
                            userId={user.id}
                            userName={user.name}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
