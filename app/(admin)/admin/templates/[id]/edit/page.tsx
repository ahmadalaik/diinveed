import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { EditTemplateForm } from "@/features/template/components/edit-template-form";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await adminIsRequired();
  const { id } = await params;

  const template = await prisma.template.findUnique({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      category: true,
      description: true,
      status: true,
      thumbnailUrl: true,
    },
  });

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Templates", href: "/admin/templates" },
          { label: template.name },
          { label: "Edit" },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/templates">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit {template.name}</h1>
      </div>
      <div className="max-w-lg">
        <EditTemplateForm values={template} />
      </div>
    </div>
  );
}
