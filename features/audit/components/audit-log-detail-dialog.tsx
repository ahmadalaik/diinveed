import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { actionLabel } from "../configs/audit-actions";
import type { AuditLogListItem } from "../types/audit.type";

export function AuditLogDetailDialog({ log }: { log: AuditLogListItem }) {
  const rows: [string, string][] = [
    ["Aksi", actionLabel(log.action)],
    ["Aktor", log.actorLabel],
    ["Target", log.targetLabel ?? log.targetId ?? "-"],
    ["Tipe target", log.targetType ?? "-"],
    ["IP", log.ipAddress ?? "-"],
    ["User agent", log.userAgent ?? "-"],
    ["Waktu", log.createdAt.toLocaleString("id-ID")],
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Detail</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Audit Log</DialogTitle>
          <DialogDescription>Informasi lengkap aktivitas tercatat.</DialogDescription>
        </DialogHeader>
        <dl className="space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="col-span-2 break-all">{v}</dd>
            </div>
          ))}
          {log.metadata != null && (
            <div className="grid grid-cols-3 gap-2">
              <dt className="text-muted-foreground">Metadata</dt>
              <dd className="col-span-2">
                <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </dd>
            </div>
          )}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
