"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import { Gallery, InvitationState } from "../types/invitation.type";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { generatePublicToken } from "../lib/slug";
import { DEFAULT_WISHES_OPTIONS } from "../schemas/wish.schema";

type Result =
  | { errors: { _form: string[] }; invitation?: undefined }
  | { errors?: undefined; invitation: InvitationState };

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

function normalizeInvitation(invitation: InvitationState): InvitationState {
  return { ...invitation, gallery: normalizeGallery(invitation.gallery) };
}

export async function getOrCreateInvitation(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const existing = await prisma.invitation.findUnique({
    where: { userId: user.id },
  });
  if (existing)
    return {
      invitation: normalizeInvitation(existing as unknown as InvitationState),
    };

  const created = await prisma.invitation.create({
    data: {
      userId: user.id,
      publicToken: generatePublicToken(),
      tokenId: "aura",
      templateSlug: "kelana",
      rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
      wishesOptions: DEFAULT_WISHES_OPTIONS,
      events: [],
      stories: [],
      gallery: [],
      gifts: [],
    },
  });

  return { invitation: created as unknown as InvitationState };
}
