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

/** Merge draft content with live identity/metadata into the editor state. */
function toEditorState(
  inv: Record<string, unknown>,
  content: SaveInvitationType,
  hasUnpublishedChanges: boolean,
  updatedAt: Date | null,
): EditorInitialData {
  return {
    ...content,
    gallery: normalizeGallery(content.gallery),
    id: inv.id as string,
    userId: inv.userId as string,
    publicToken: inv.publicToken as string,
    isPublished: (inv.isPublished as boolean) ?? false,
    wishesOptions:
      (inv.wishesOptions as EditorInitialData["wishesOptions"]) ?? null,
    slug: content.slug,
    liveSlug: (inv.slug as string) ?? "",
    hasUnpublishedChanges,
    updatedAt,
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
    const draft = existingRecord.draft as {
      data: unknown;
      hasUnpublishedChanges: boolean;
      updatedAt: Date;
    } | null;

    if (!draft) {
      const newDraft = await prisma.invitationDraft.create({
        data: {
          invitationId: existingRecord.id as string,
          data: DEFAULT_INVITATION_CONTENT as object,
          hasUnpublishedChanges: false,
        },
      });
      return ok(
        "Undangan dimuat",
        toEditorState(
          existingRecord,
          DEFAULT_INVITATION_CONTENT,
          false,
          newDraft.updatedAt,
        ),
      );
    }

    const content = {
      ...DEFAULT_INVITATION_CONTENT,
      ...(draft.data as Partial<SaveInvitationType>),
    } as SaveInvitationType;
    return ok(
      "Undangan dimuat",
      toEditorState(
        existingRecord,
        content,
        draft.hasUnpublishedChanges,
        draft.updatedAt,
      ),
    );
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

  const newDraft = await prisma.invitationDraft.create({
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
      newDraft.updatedAt,
    ),
  );
}
