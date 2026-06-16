"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { moderateWishSchema, ModerateWishType } from "../schemas/wish.schema";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

const STATUS_BY_ACTION: Record<ModerateWishType["action"], "APPROVED" | "HIDDEN"> = {
  approve: "APPROVED",
  show: "APPROVED",
  hide: "HIDDEN",
};

export async function moderateWish(
  input: ModerateWishType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = moderateWishSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Aksi tidak valid");
  }

  const { id, action } = parsed.data;

  const wish = await prisma.guestRsvp.findFirst({
    where: { id, invitation: { userId: user.id } },
    select: { id: true },
  });
  if (!wish) return fail("Ucapan tidak ditemukan");

  const newStatus = STATUS_BY_ACTION[action];

  await prisma.guestRsvp.update({
    where: { id },
    data: { moderationStatus: newStatus },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "wish.moderated",
    targetType: "wish",
    targetId: id,
    metadata: { status: newStatus },
  });

  revalidatePath("/rsvp");
  return ok("Status ucapan diperbarui");
}
