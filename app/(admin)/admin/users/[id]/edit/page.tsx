import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "@/features/user/components/role-selector";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { canManageUser, getAllowedRoles } from "@/lib/permissions";
import { UpdateUserForm } from "@/features/user/components/form/update-user-form";

export default async function EditUserPage({
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
      username: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  if (!user || !canManageUser(actor, user)) {
    notFound();
  }

  const values = {
    ...user,
    password: "",
    phone: user.phone ?? undefined,
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Users", href: "/admin/users" },
          { label: user.name, href: `/admin/users/${user.id}` },
          { label: "Edit" },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/users/${user.id}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit {user.name}</h1>
      </div>
      <div className="grid max-w-2xl gap-8">
        <section>
          <h2 className="mb-4 text-base font-medium">Profile</h2>
          <UpdateUserForm actorRole={actor.role} values={values} />
        </section>
        <section>
          <h2 className="mb-4 text-base font-medium">Role</h2>
          <RoleSelector
            userId={user.id}
            currentRole={user.role}
            allowedRoles={getAllowedRoles(actor.role)}
          />
        </section>
      </div>
    </div>
  );
}
