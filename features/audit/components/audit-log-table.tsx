import { ScrollText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableCard } from "@/components/data-table-card";
import { TableEmptyState } from "@/components/table-empty-state";
import type { PageSearchParams } from "@/lib/pagination";
import type { AuditLogListItem } from "../types/audit.type";
import { ActionBadge } from "./action-badge";
import { AuditLogDetailDialog } from "./audit-log-detail-dialog";

interface AuditLogTableProps {
  logs: AuditLogListItem[];
  total: number;
  perPage: number;
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
}

export function AuditLogTable({
  logs,
  total,
  perPage,
  page,
  totalPages,
  searchParams,
}: AuditLogTableProps) {
  if (total === 0) {
    return (
      <TableEmptyState
        icon={ScrollText}
        title="Belum ada aktivitas"
        description="Aktivitas yang mengubah data akan tercatat di sini."
      />
    );
  }

  return (
    <DataTableCard
      total={total}
      shownCount={logs.length}
      noun="aktivitas"
      perPage={perPage}
      page={page}
      totalPages={totalPages}
      searchParams={searchParams}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Waktu</TableHead>
            <TableHead className="px-4 py-3">Aktor</TableHead>
            <TableHead className="px-4 py-3">Aksi</TableHead>
            <TableHead className="px-4 py-3">Target</TableHead>
            <TableHead className="px-4 py-3">IP</TableHead>
            <TableHead className="px-4 py-3 text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="group">
              <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                {log.createdAt.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="px-4 py-3 font-medium">{log.actorLabel}</TableCell>
              <TableCell className="px-4 py-3">
                <ActionBadge action={log.action} />
              </TableCell>
              <TableCell className="px-4 py-3">
                {log.targetLabel ?? log.targetId ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                {log.ipAddress ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <AuditLogDetailDialog log={log} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableCard>
  );
}
