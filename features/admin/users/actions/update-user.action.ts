"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser } from "@/lib/permissions";
import {
  updateUserSchema,
  type UpdateUserType,
} from "../schemas/update-user.schema";

type FieldErrors = Partial<Record<keyof UpdateUserType | "_form", string[]>>;

export type UpdateUserActionResult =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function updateUserAction(
  userId: string,
  input: UpdateUserType,
): Promise<UpdateUserActionResult> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: { id: true, role: true },
  });

  if (!target) {
    return { errors: { _form: ["User not found"] } };
  }

  if (!canManageUser(actor, target)) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const { name, username, email, phone } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        NOT: { id: userId },
        OR: [{ email }, { username }],
      },
      select: { email: true, username: true },
    });

    if (existing) {
      if (existing.email === email) {
        return { errors: { email: ["Email already in use"] } };
      }
      return { errors: { username: ["Username already in use"] } };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name, username, email, phone: phone ?? null },
    });

    return { success: true };
  } catch {
    return { errors: { _form: ["Failed to update user, please try again"] } };
  }
}
