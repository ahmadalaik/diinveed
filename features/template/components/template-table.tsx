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
import { Eye, Pencil } from "lucide-react";

interface TemplateTableProps {
  templates: TemplateListItem[];
}

export function TemplateTable({ templates }: TemplateTableProps) {
  if (templates.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Template tidak ditemukan.
      </div>
    );
  }

  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5">
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
              <TableRow key={template.id}>
                <TableCell className="px-4 py-3 font-medium">
                  {template.name}
                </TableCell>
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
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <span
                    className={
                      template.status === "active"
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {template.status.charAt(0).toUpperCase() +
                      template.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/templates/${template.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/templates/${template.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
