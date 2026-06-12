"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import { EditorInitialData, Gallery } from "../types/invitation.type";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { generatePublicToken } from "../lib/slug";
import { DEFAULT_WISHES_OPTIONS } from "../schemas/wish.schema";
import { logAudit } from "@/lib/audit";
import {
  DEFAULT_INVITATION_CONTENT,
  SaveInvitationType,
} from "../schemas/invitation.schema";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

function normalizeGallery(gallery: unknown): Gallery[] {
  if (!Array.isArray(gallery)) return [];
  return gallery.map((item) => {
    if (typeof item === "string") {
      return { id: randomUUID(), url: item, key: "" };
    }
    const obj = (item ?? {}) as Partial<Gallery>;
    return {
      id: obj.id ?? randomUUID(),
      url: obj.url ?? "",
      key: obj.key ?? "",
    };
  });
}

/** Build the editable content snapshot from an Invitation row (legacy seed). */
function contentFromInvitation(
  inv: Record<string, unknown>,
): SaveInvitationType {
  return {
    ...DEFAULT_INVITATION_CONTENT,
    coverImage: (inv.coverImage as string | null) ?? null,
    coverImageKey: (inv.coverImagePublicId as string | null) ?? null,
    music: (inv.music as string) ?? "",
    musicKey: (inv.musicPublicId as string | null) ?? "",
    quote: (inv.quote as string) ?? "",
    quoteReference: (inv.quoteReference as string) ?? "",
    isBrideFirst: (inv.isBrideFirst as boolean) ?? true,
    brideName: (inv.brideName as string) ?? "",
    brideNickname: (inv.brideNickname as string) ?? "",
    brideDescription: (inv.brideDescription as string | null) ?? null,
    brideImage: (inv.brideImage as string | null) ?? null,
    brideImageKey: (inv.brideImagePublicId as string | null) ?? null,
    groomName: (inv.groomName as string) ?? "",
    groomNickname: (inv.groomNickname as string) ?? "",
    groomDescription: (inv.groomDescription as string | null) ?? null,
    groomImage: (inv.groomImage as string | null) ?? null,
    groomImageKey: (inv.groomImagePublicId as string | null) ?? null,
    slug: (inv.slug as string) ?? "",
    title: (inv.title as string) ?? "",
    tokenId: (inv.tokenId as string) ?? "aura",
    tokenOverrides: (inv.tokenOverrides as SaveInvitationType["tokenOverrides"]) ?? null,
    templateSlug: (inv.templateSlug as string) ?? "kelana",
    backgroundType: (inv.backgroundType as string) ?? "solid",
    rsvpDeadline: (inv.rsvpDeadline as string) ?? "",
    rsvpOptions: (inv.rsvpOptions as SaveInvitationType["rsvpOptions"]) ??
      DEFAULT_INVITATION_CONTENT.rsvpOptions,
    events: (inv.events as SaveInvitationType["events"]) ?? [],
    stories: (inv.stories as SaveInvitationType["stories"]) ?? [],
    gallery: (inv.gallery as SaveInvitationType["gallery"]) ?? [],
    gifts: (inv.gifts as SaveInvitationType["gifts"]) ?? [],
  };
}

/** Merge draft content with live identity/metadata into the editor state. */
function toEditorState(
  inv: Record<string, unknown>,
  content: SaveInvitationType,
  hasUnpublishedChanges: boolean,
): EditorInitialData {
  return {
    ...content,
    gallery: normalizeGallery(content.gallery),
    id: inv.id as string,
    userId: inv.userId as string,
    publicToken: inv.publicToken as string,
    isPublished: (inv.isPublished as boolean) ?? false,
    wishesOptions: (inv.wishesOptions as EditorInitialData["wishesOptions"]) ?? null,
    slug: content.slug,
    liveSlug: (inv.slug as string) ?? "",
    hasUnpublishedChanges,
  };
}

export async function getOrCreateInvitation(): Promise<
  ActionResponse<EditorInitialData>
> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const existing = await prisma.invitation.findUnique({
    where: { userId: user.id },
    include: { draft: true },
  });

  if (existing) {
    const existingRecord = existing as unknown as Record<string, unknown>;
    const draft = existingRecord.draft as
      | { data: unknown; hasUnpublishedChanges: boolean }
      | null;

    if (draft) {
      const content = {
        ...DEFAULT_INVITATION_CONTENT,
        ...(draft.data as Partial<SaveInvitationType>),
      } as SaveInvitationType;
      return ok(
        "Undangan dimuat",
        toEditorState(existingRecord, content, draft.hasUnpublishedChanges),
      );
    }

    const content = contentFromInvitation(existingRecord);
    await prisma.invitationDraft.create({
      data: {
        invitationId: existingRecord.id as string,
        data: content as object,
        hasUnpublishedChanges: false,
      },
    });
    return ok("Undangan dimuat", toEditorState(existingRecord, content, false));
  }

  const created = await prisma.invitation.create({
    data: {
      userId: user.id,
      publicToken: generatePublicToken(),
      tokenId: "aura",
      templateSlug: "kelana",
      rsvpOptions: DEFAULT_INVITATION_CONTENT.rsvpOptions,
      wishesOptions: DEFAULT_WISHES_OPTIONS,
      events: [],
      stories: [],
      gallery: [],
      gifts: [],
    },
  });

  await prisma.invitationDraft.create({
    data: {
      invitationId: created.id,
      data: DEFAULT_INVITATION_CONTENT as object,
      hasUnpublishedChanges: false,
    },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "invitation.created",
    targetType: "invitation",
    targetId: created.id,
  });

  return ok(
    "Undangan dimuat",
    toEditorState(
      created as unknown as Record<string, unknown>,
      DEFAULT_INVITATION_CONTENT,
      false,
    ),
  );
}
