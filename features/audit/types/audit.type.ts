import type { AuditAction } from "@/lib/audit-actions";

export type AuditLogListItem = {
  id: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  targetLabel: string | null;
  metadata: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};

export type AuditActionOption = { value: AuditAction; label: string };
