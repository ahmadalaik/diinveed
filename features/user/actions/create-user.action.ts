"use server";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/features/auth/utils/password";
import { getCurrentUser } from "@/features/auth/utils/session";
import { getAllowedRoles } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import {
  createUserSchema,
  type CreateUserType,
} from "../schemas/create-user.schema";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function createUserAction(
  input: CreateUserType,
): Promise<ActionResponse<{ userId: string }>> {
  const actor = await getCurrentUser();
  if (!actor) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const { name, username, email, password, role, phone } = parsed.data;

  if (!getAllowedRoles(actor.role).includes(role)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  try {
    const existing = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email }, { username }],
      },
      select: { email: true, username: true },
    });

    if (existing) {
      if (existing.email === email) {
        return fail("Email sudah digunakan", { email: ["Email sudah digunakan"] });
      }
      return fail("Username sudah digunakan", {
        username: ["Username sudah digunakan"],
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role,
        phone: phone ?? null,
      },
      select: { id: true },
    });

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.created",
      targetType: "user",
      targetId: user.id,
      targetLabel: name,
    });

    return ok("Pengguna berhasil dibuat", { userId: user.id });
  } catch {
    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
