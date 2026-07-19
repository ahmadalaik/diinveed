import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserDetail } from "@/features/user/components/user-detail";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { canViewUser } from "@/lib/permissions";
import type { UserListItem } from "@/features/user/types/user.type";
import type { UserRole } from "@/generated/prisma/enums";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const actor = await adminIsRequired();
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id, deletedAt: null },
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
  });

  if (!user || !canViewUser(actor.role, user.role as UserRole)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
      />
      <UserDetail user={user as UserListItem} currentUser={actor} />
    </div>
  );
}
