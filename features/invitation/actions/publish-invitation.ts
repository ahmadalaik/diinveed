"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";

type PublishResult =
  | { errors: { _form: string[] }; token?: undefined }
  | { errors?: undefined; token: string };

type UnpublishResult =
  | { errors: { _form: string[] }; success?: undefined }
  | { errors?: undefined; success: true };

export async function publishInvitation(): Promise<PublishResult> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const updated = await prisma.invitation.update({
    where: { userId: user.id },
    data: { isPublished: true },
    select: { token: true },
  });

  return { token: updated.token };
}

export async function unpublishInvitation(): Promise<UnpublishResult> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  await prisma.invitation.update({
    where: { userId: user.id },
    data: { isPublished: false },
  });

  return { success: true };
}
