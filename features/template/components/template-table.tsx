import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TemplateListItem } from "../types/template.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Pencil, LayoutTemplate } from "lucide-react";
import { DataTableCard } from "@/components/data-table-card";
import { TableEmptyState } from "@/components/table-empty-state";
import type { PageSearchParams } from "@/lib/pagination";

interface TemplateTableProps {
  templates: TemplateListItem[];
  total: number;
  perPage: number;
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
}

export function TemplateTable({
  templates,
  total,
  perPage,
  page,
  totalPages,
  searchParams,
}: TemplateTableProps) {
  if (total === 0) {
    return (
      <TableEmptyState
        icon={LayoutTemplate}
        title="Belum ada template"
        description="Tambahkan template pertama untuk mulai menawarkannya ke pengguna."
        action={
          <Button asChild size="sm">
            <Link href="/admin/templates/new">Tambah Template</Link>
          </Button>
        }
      />
    );
  }

  return (
    <DataTableCard
      total={total}
      shownCount={templates.length}
      noun="template"
      perPage={perPage}
      page={page}
      totalPages={totalPages}
      searchParams={searchParams}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Nama</TableHead>
            <TableHead className="px-4 py-3">Kategori</TableHead>
            <TableHead className="px-4 py-3">Demo URL</TableHead>
            <TableHead className="px-4 py-3">Tags</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id} className="group">
              <TableCell className="px-4 py-3 font-medium">{template.name}</TableCell>
              <TableCell className="px-4 py-3">{template.category}</TableCell>
              <TableCell className="px-4 py-3">
                {template.demoUrl ? (
                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {template.demoUrl}
                  </a>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {template.tags && template.tags.length > 0 ? (
                    template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <Badge variant={template.status === "active" ? "default" : "secondary"}>
                  {template.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/templates/${template.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Lihat</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/templates/${template.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Ubah</span>
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableCard>
  );
}
