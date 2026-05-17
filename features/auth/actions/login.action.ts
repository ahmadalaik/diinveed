"use server";

import prisma from "@/lib/prisma";
import { loginSchema, LoginType } from "@/features/auth/schemas/login.schema";
import { verifyPassword } from "@/features/auth/utils/password";
import { createSession } from "@/features/auth/utils/session";
import { homeRouteForRole } from "@/types/role.type";

type FieldErrors = Partial<Record<keyof LoginType | "_form", string[]>>;

export type LoginActionResult =
  | { errors: FieldErrors; success?: undefined; redirectTo?: undefined }
  | { errors?: undefined; success: true; redirectTo: string };

export async function loginAction(
  input: LoginType,
): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const { identifier, password } = parsed.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: { id: true, password: true, role: true, status: true },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return { errors: { _form: ["Invalid username/email or password"] } };
    }

    if (user.status !== "active") {
      return { errors: { _form: ["This account is not active"] } };
    }

    await createSession(user.id);

    return { success: true, redirectTo: homeRouteForRole(user.role) };
  } catch (error) {
    console.log("Login Error: ", error);

    return { errors: { _form: ["Login failed, please try again"] } };
  }
}
