import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { CreateTemplateForm } from "@/features/template/components/create-template-form";
import { adminIsRequired } from "@/features/auth/utils/middleware";

export default async function NewTemplatePage() {
  await adminIsRequired();

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Templates", href: "/admin/templates" },
          { label: "New Template" },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/templates">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">New Template</h1>
      </div>
      <div className="max-w-lg">
        <CreateTemplateForm />
      </div>
    </div>
  );
}
