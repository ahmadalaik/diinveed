"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import type { MessageTemplate } from "../types/guest.type";

type Result =
  | { errors: { _form: string[] }; templates?: undefined }
  | { errors?: undefined; templates: MessageTemplate[] };

export async function getMessageTemplates(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const templates = await prisma.messageTemplate.findMany({
    where: { invitationId: invitation.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, body: true },
  });

  return { templates };
}
