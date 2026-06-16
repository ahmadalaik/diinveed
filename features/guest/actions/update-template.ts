"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import {
  messageTemplateSchema,
  type MessageTemplateType,
} from "../schemas/message-template.schema";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function updateTemplate(
  input: MessageTemplateType & { id: string },
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = messageTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const template = await prisma.messageTemplate.findUnique({
    where: { id: input.id },
    select: { invitation: { select: { userId: true } } },
  });
  if (!template || template.invitation.userId !== user.id) {
    return fail("Template tidak ditemukan");
  }

  await prisma.messageTemplate.update({
    where: { id: input.id },
    data: { title: parsed.data.title, body: parsed.data.body },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "guest_template.updated",
    targetType: "guest_template",
    targetId: input.id,
    targetLabel: parsed.data.title,
  });

  revalidatePath("/tamu");
  return ok("Template diperbarui");
}
