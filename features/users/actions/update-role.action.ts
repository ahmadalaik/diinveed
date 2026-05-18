"use server";

import z from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/utils/session";
import { canManageUser, getAllowedRoles } from "@/lib/permissions";

const updateRoleSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
});

export type UpdateRoleActionResult =
  | { errors: { _form: string[] }; success?: undefined }
  | { errors?: undefined; success: true };

export async function updateRoleAction(
  userId: string,
  role: "user" | "admin" | "super_admin",
): Promise<UpdateRoleActionResult> {
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

  const parsed = updateRoleSchema.safeParse({ role });
  if (!parsed.success) {
    return { errors: { _form: ["Invalid role"] } };
  }

  if (!getAllowedRoles(actor.role).includes(parsed.data.role)) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
    });
    return { success: true };
  } catch {
    return { errors: { _form: ["Failed to update role, please try again"] } };
  }
}
