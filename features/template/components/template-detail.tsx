import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TemplateListItem } from "../types/template.type";

export function TemplateDetail({ template }: { template: TemplateListItem }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{template.name}</h1>
          <p className="text-sm text-muted-foreground">{template.slug}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/templates/${template.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border">
          <dl className="divide-y">
            <DetailRow label="Category" value={template.category} />
            <DetailRow
              label="Status"
              value={
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
              }
            />
            <DetailRow
              label="Demo URL"
              value={
                template.demoUrl ? (
                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {template.demoUrl}
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )
              }
            />
            <DetailRow
              label="Tags"
              value={
                template.tags && template.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )
              }
            />
            {template.description && (
              <DetailRow label="Description" value={template.description} />
            )}
            <DetailRow
              label="Created"
              value={template.createdAt.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          </dl>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Thumbnail</p>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src={template.thumbnailUrl}
              alt={`${template.name} thumbnail`}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start px-4 py-3 text-sm">
      <dt className="w-32 shrink-0 font-medium text-muted-foreground">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
