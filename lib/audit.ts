import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { AuditAction } from "./audit-actions";

type LogAuditInput = {
  actorId?: string | null;
  actorLabel: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
};

export async function logAudit(input: LogAuditInput): Promise<void> {
  try {
    const h = await headers();
    const ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = h.get("user-agent") ?? null;

    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        actorLabel: input.actorLabel,
        action: input.action,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        targetLabel: input.targetLabel ?? null,
        metadata: (input.metadata as Prisma.InputJsonValue) ?? undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("logAudit failed:", error);
  }
}
