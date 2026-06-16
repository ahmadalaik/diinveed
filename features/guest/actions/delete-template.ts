"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function deleteTemplate(id: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const template = await prisma.messageTemplate.findUnique({
    where: { id },
    select: { invitation: { select: { userId: true } } },
  });
  if (!template || template.invitation.userId !== user.id) {
    return fail("Template tidak ditemukan");
  }

  await prisma.messageTemplate.delete({ where: { id } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "guest_template.deleted",
    targetType: "guest_template",
    targetId: id,
    targetLabel: id,
  });

  revalidatePath("/tamu");
  return ok("Template dihapus");
}
