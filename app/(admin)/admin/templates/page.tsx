import { adminIsRequired } from "@/features/auth/utils/middleware";
import { TemplateTable } from "@/features/template/components/template-table";
import prisma from "@/lib/prisma";
import type { TemplateListItem } from "@/features/template/types/template.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminTemplatePage() {
  await adminIsRequired();

  const templates = await prisma.template.findMany({
    where: { deletedAt: null },
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <Button asChild>
          <Link href="/admin/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Template
          </Link>
        </Button>
      </div>
      <TemplateTable templates={templates as TemplateListItem[]} />
    </div>
  );
}
