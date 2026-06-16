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

export async function markGuestSent(id: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const guest = await prisma.guest.findUnique({
    where: { id },
    select: { invitation: { select: { userId: true } } },
  });
  if (!guest || guest.invitation.userId !== user.id) {
    return fail("Tamu tidak ditemukan");
  }

  await prisma.guest.update({
    where: { id },
    data: { sentAt: new Date() },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "guest.marked_sent",
    targetType: "guest",
    targetId: id,
    targetLabel: id,
  });

  revalidatePath("/tamu");
  return ok("Ditandai sudah dikirim");
}
