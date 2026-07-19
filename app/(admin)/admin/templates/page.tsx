import { adminIsRequired } from "@/features/auth/utils/middleware";
import { TemplateTable } from "@/features/template/components/template-table";
import prisma from "@/lib/prisma";
import type { TemplateListItem } from "@/features/template/types/template.type";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getPagination, getTotalPages, type PageSearchParams } from "@/lib/pagination";

export default async function AdminTemplatePage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  await adminIsRequired();
  const sp = await searchParams;
  const { page, perPage, skip, take } = getPagination(sp);

  const where = { deletedAt: null };

  const [templates, total] = await Promise.all([
    prisma.template.findMany({
      where,
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
      skip,
      take,
    }),
    prisma.template.count({ where }),
  ]);

  const totalPages = getTotalPages(total, perPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Template"
        actions={
          <Button asChild>
            <Link href="/admin/templates/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Template
            </Link>
          </Button>
        }
      />
      <TemplateTable
        templates={templates as TemplateListItem[]}
        total={total}
        perPage={perPage}
        page={page}
        totalPages={totalPages}
        searchParams={sp}
      />
    </div>
  );
}
