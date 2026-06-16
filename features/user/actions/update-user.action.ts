"use server";

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { hashPassword } from "@/features/auth/utils/password";
import { canManageUser } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import {
  updateUserSchema,
  type UpdateUserType,
} from "../schemas/update-user.schema";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function updateUserAction(
  userId: string,
  input: UpdateUserType,
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

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, username, email, password, phone } = parsed.data;

  try {
    // Only check uniqueness against the fields actually being changed.
    const orConds: Prisma.UserWhereInput[] = [];
    if (email !== undefined) orConds.push({ email });
    if (username !== undefined) orConds.push({ username });

    if (orConds.length > 0) {
      const existing = await prisma.user.findFirst({
        where: { deletedAt: null, NOT: { id: userId }, OR: orConds },
        select: { email: true, username: true },
      });

      if (existing) {
        if (email !== undefined && existing.email === email) {
          return fail("Email sudah digunakan", { email: ["Email sudah digunakan"] });
        }
        return fail("Username sudah digunakan", {
          username: ["Username sudah digunakan"],
        });
      }
    }

    // Build a PATCH payload from only the provided fields.
    const data: Prisma.UserUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (username !== undefined) data.username = username;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (password !== undefined) data.password = await hashPassword(password);

    await prisma.user.update({ where: { id: userId }, data });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.updated",
      targetType: "user",
      targetId: userId,
      targetLabel: name ?? userId,
    });

    return ok("Pengguna berhasil diperbarui");
  } catch {
    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
