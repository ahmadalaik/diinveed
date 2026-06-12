"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function deleteWish(id: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const wish = await prisma.guestRsvp.findFirst({
    where: { id, invitation: { userId: user.id } },
    select: { id: true },
  });
  if (!wish) return fail("Ucapan tidak ditemukan");

  await prisma.guestRsvp.delete({ where: { id } });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "wish.deleted",
    targetType: "wish",
    targetId: id,
  });

  revalidatePath("/rsvp");
  return ok("Ucapan dihapus");
}
