import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { TemplateDetail } from "@/features/template/components/template-detail";
import type { TemplateListItem } from "@/features/template/types/template.type";

export default async function TemplateDetailPage({
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
      slug: true,
      category: true,
      description: true,
      thumbnailUrl: true,
      demoUrl: true,
      tags: true,
      status: true,
      createdAt: true,
      deletedAt: true,
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
        ]}
      />
      <TemplateDetail template={template as TemplateListItem} />
    </div>
  );
}
