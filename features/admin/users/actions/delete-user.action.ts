"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser } from "@/lib/permissions";

export type DeleteUserActionResult =
  | { errors: { _form: string[] }; success?: undefined }
  | { errors?: undefined; success: true };

export async function deleteUserAction(
  userId: string,
): Promise<DeleteUserActionResult> {
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

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  } catch {
    return { errors: { _form: ["Failed to delete user, please try again"] } };
  }
}
