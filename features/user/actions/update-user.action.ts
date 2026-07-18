"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser, type Target } from "@/lib/permissions";
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

  if (!canManageUser(actor, target as Target)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, email, password, phone, role } = parsed.data;

  try {
    if (email !== undefined) {
      const existing = await prisma.user.findFirst({
        where: { NOT: { id: userId }, email },
      });
      if (existing) {
        return fail("Email sudah digunakan", {
          email: ["Email sudah digunakan"],
        });
      }
    }

    const data: { name?: string; email?: string; phone?: string; role?: string } = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (role !== undefined) {
      data.role = role;
    }

    if (Object.keys(data).length > 0) {
      await auth.api.adminUpdateUser({
        body: {
          userId,
          data,
        },
        headers: await headers(),
      });
    }

    if (password !== undefined) {
      await auth.api.setUserPassword({
        body: {
          userId,
          newPassword: password,
        },
        headers: await headers(),
      });
    }

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.updated",
      targetType: "user",
      targetId: userId,
      targetLabel: name ?? userId,
    });

    return ok("Pengguna berhasil diperbarui");
  } catch (error) {
    console.log("Error update user: ", error);

    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
