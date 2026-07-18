"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

  const { name, email, password, role, phone } = parsed.data;

  if (!getAllowedRoles(actor.role).includes(role)) {
    return fail(ACTION_MESSAGES.UNAUTHORIZED);
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      return fail("Email sudah digunakan", { email: ["Email sudah digunakan"] });
    }

    const userRes = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role,
        data: {
          phone: phone ?? null,
          emailVerified: true,
          status: "active",
        },
      },
    });

    const user = userRes.user;

    await logAudit({
      actorId: actor.id,
      actorLabel: actor.name ?? actor.id,
      action: "user.created",
      targetType: "user",
      targetId: user.id,
      targetLabel: name,
    });

    return ok("Pengguna berhasil dibuat", { userId: user.id });
  } catch (error) {
    console.log("Error create user: ", error);

    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
