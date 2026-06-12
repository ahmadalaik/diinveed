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

export async function createTemplate(
  input: MessageTemplateType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = messageTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return fail("Undangan tidak ditemukan");

  const created = await prisma.messageTemplate.create({
    data: { invitationId: invitation.id, title: parsed.data.title, body: parsed.data.body },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "guest_template.created",
    targetType: "guest_template",
    targetId: created.id,
    targetLabel: parsed.data.title,
  });

  revalidatePath("/tamu");
  return ok("Template ditambahkan");
}
