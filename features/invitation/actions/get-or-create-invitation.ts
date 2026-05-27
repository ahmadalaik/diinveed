"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import { InvitationState } from "../types/invitation.type";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

type Result =
  | { errors: { _form: string[] }; invitation?: undefined }
  | { errors?: undefined; invitation: InvitationState };

export async function getOrCreateInvitation(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const existing = await prisma.invitation.findUnique({
    where: { userId: user.id },
  });
  if (existing) return { invitation: existing as unknown as InvitationState };

  const created = await prisma.invitation.create({
    data: {
      userId: user.id,
      token: randomUUID().toString(),
      tokenId: "aura",
      message: "",
      venueAddress: "",
      rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
      events: [],
      stories: [],
      gallery: [],
      stickers: [],
      gifts: [],
    },
  });

  return { invitation: created as unknown as InvitationState };
}
