import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { CreateUserForm } from "@/features/user/components/form/create-user-form";
import { adminIsRequired } from "@/features/auth/utils/middleware";

export default async function NewUserPage() {
  const actor = await adminIsRequired();

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Users", href: "/admin/users" },
          { label: "New User" },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">New User</h1>
      </div>
      <div className="max-w-lg">
        <CreateUserForm actorRole={actor.role} />
      </div>
    </div>
  );
}
