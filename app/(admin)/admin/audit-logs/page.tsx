import prisma from "@/lib/prisma";
import { superAdminIsRequired } from "@/features/auth/utils/middleware";
import { PageHeader } from "@/components/page-header";
import {
  getPagination,
  getTotalPages,
  type PageSearchParams,
} from "@/lib/pagination";
import { AuditLogTable } from "@/features/audit/components/audit-log-table";
import { AuditLogFilters } from "@/features/audit/components/audit-log-filters";
import type { AuditLogListItem } from "@/features/audit/types/audit.type";
import type { Prisma } from "@/generated/prisma/client";

function single(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function parseDate(v: string | undefined): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  await superAdminIsRequired();
  const sp = await searchParams;
  const { page, perPage, skip, take } = getPagination(sp);

  const action = single(sp.action);
  const q = single(sp.q);
  const from = parseDate(single(sp.from));
  const to = parseDate(single(sp.to));

  const where: Prisma.AuditLogWhereInput = {
    ...(action ? { action } : {}),
    ...(from || to
      ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
      : {}),
    ...(q
      ? {
          OR: [
            { actorLabel: { contains: q } },
            { targetLabel: { contains: q } },
          ],
        }
      : {}),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.auditLog.count({ where }),
  ]);

  const totalPages = getTotalPages(total, perPage);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" />
      <AuditLogFilters />
      <AuditLogTable
        logs={logs as AuditLogListItem[]}
        total={total}
        perPage={perPage}
        page={page}
        totalPages={totalPages}
        searchParams={sp}
      />
    </div>
  );
}
