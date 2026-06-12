"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  saveInvitationSchema,
  SaveInvitationType,
} from "../schemas/invitation.schema";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function saveInvitation(
  input: SaveInvitationType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = saveInvitationSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return fail("Undangan tidak ditemukan");

  await prisma.invitationDraft.update({
    where: { invitationId: invitation.id },
    data: {
      data: parsed.data as object,
      hasUnpublishedChanges: true,
    },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "invitation.saved",
    targetType: "invitation",
    targetId: invitation.id,
  });

  return ok("Perubahan tersimpan");
}
