"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser, type Target } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function deleteUserAction(
  userId: string,
): Promise<ActionResponse> {
  const actor = await getCurrentUser();
  if (!actor) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const target = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: { id: true, role: true },
  });

  if (!target) {
    return fail("Pengguna tidak ditemukan");
  }

  if (!canManageUser(actor, target as Target)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    await auth.api.revokeUserSessions({
      body: { userId },
      headers: await headers(),
    });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.deleted",
      targetType: "user",
      targetId: userId,
      targetLabel: userId,
    });

    return ok("Pengguna berhasil dihapus");
  } catch {
    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
