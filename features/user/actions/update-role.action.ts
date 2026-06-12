"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser, getAllowedRoles } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

const updateRoleSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
});

export async function updateRoleAction(
  userId: string,
  role: "user" | "admin" | "super_admin",
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

  if (!canManageUser(actor, target)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const parsed = updateRoleSchema.safeParse({ role });
  if (!parsed.success) {
    return fail("Peran tidak valid");
  }

  if (!getAllowedRoles(actor.role).includes(parsed.data.role)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
    });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.role_updated",
      targetType: "user",
      targetId: userId,
      metadata: { from: target.role, to: parsed.data.role },
    });

    return ok("Peran berhasil diperbarui");
  } catch {
    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
