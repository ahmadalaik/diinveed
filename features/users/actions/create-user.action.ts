"use server";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/features/auth/utils/password";
import { getCurrentUser } from "@/features/auth/utils/session";
import { getAllowedRoles } from "@/lib/permissions";
import {
  createUserSchema,
  type CreateUserType,
} from "../schemas/create-user.schema";

type FieldErrors = Partial<Record<keyof CreateUserType | "_form", string[]>>;

export type CreateUserActionResult =
  | { errors: FieldErrors; success?: undefined; userId?: undefined }
  | { errors?: undefined; success: true; userId: string };

export async function createUserAction(
  input: CreateUserType,
): Promise<CreateUserActionResult> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { errors: { _form: ["Unauthorized"] } };
  }

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const { name, username, email, password, role, phone } = parsed.data;

  if (!getAllowedRoles(actor.role).includes(role)) {
    return { errors: { _form: ["Unauthorized"] } };
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
        return { errors: { email: ["Email already in use"] } };
      }
      return { errors: { username: ["Username already in use"] } };
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

    return { success: true, userId: user.id };
  } catch {
    return { errors: { _form: ["Failed to create user, please try again"] } };
  }
}
