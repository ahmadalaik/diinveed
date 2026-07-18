"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import {
  publishReadySchema,
  SaveInvitationType,
} from "../schemas/invitation.schema";
import { buildCoupleSlug } from "../lib/slug";
import { Prisma } from "@/generated/prisma/client";
import { logAudit } from "@/lib/audit";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

/** Map draft content to Invitation LIVE columns. Mirrors the historical
 * save-invitation write (PublicId column naming preserved). */
function draftToLiveColumns(data: SaveInvitationType) {
  const {
    rsvpOptions,
    events,
    stories,
    gallery,
    gifts,
    dressCode,
    tokenOverrides,
    slug: _slug, // remove slug let system handle it
    ...rest
  } = data;

  return {
    ...rest,
    dressCode: dressCode as Prisma.InputJsonValue,
    tokenOverrides:
      tokenOverrides === null
        ? Prisma.DbNull
        : (tokenOverrides as Prisma.InputJsonValue),
    rsvpOptions: rsvpOptions as object,
    events: events as object[],
    stories: stories as object,
    gallery: gallery as object,
    gifts: gifts as object,
  };
}

export async function publishInvitation(): Promise<
  ActionResponse<{ invitationSlug: string }>
> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: { draft: true },
  });
  if (!invitation || !invitation.draft) {
    return fail("Undangan tidak ditemukan");
  }

  const draftData = invitation.draft.data as unknown as SaveInvitationType;

  const check = publishReadySchema.safeParse(draftData);
  if (!check.success) {
    return validationError(check.error);
  }

  const slug =
    draftData.slug ||
    invitation.slug ||
    buildCoupleSlug(
      draftData.brideNickname,
      draftData.groomNickname,
      draftData.isBrideFirst,
    );

  if (!slug) {
    return fail("URL undangan wajib diisi", {
      slug: ["URL undangan wajib diisi"],
    });
  }

  const taken = await prisma.invitation.findFirst({
    where: { slug, NOT: { id: invitation.id } },
    select: { id: true },
  });
  if (taken) {
    return fail("URL undangan sudah dipakai, silakan ganti", {
      slug: ["URL undangan sudah dipakai, silakan ganti"],
    });
  }

  await prisma.$transaction([
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { ...draftToLiveColumns(draftData), isPublished: true, slug },
    }),
    prisma.invitationDraft.update({
      where: { invitationId: invitation.id },
      data: { hasUnpublishedChanges: false },
    }),
  ]);

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "invitation.published",
    targetType: "invitation",
    targetId: invitation.id,
  });

  return ok("Undangan dipublikasikan", { invitationSlug: slug });
}

export async function unpublishInvitation(): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  await prisma.invitation.update({
    where: { userId: user.id },
    data: { isPublished: false },
  });

  return ok("Undangan disembunyikan");
}
