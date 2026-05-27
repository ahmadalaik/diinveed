"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import {
  saveInvitationSchema,
  SaveInvitationType,
} from "../schemas/invitation.schema";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

type FieldErrors = Partial<
  Record<keyof SaveInvitationType | "_form", string[]>
>;

type Result =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function saveInvitation(
  input: SaveInvitationType,
): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const parsed = saveInvitationSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const {
    rsvpOptions,
    events,
    stories,
    gallery,
    stickers,
    gifts,
    tokenOverrides,
    ...rest
  } = parsed.data;

  await prisma.invitation.update({
    where: { userId: user.id },
    data: {
      ...rest,
      tokenOverrides:
        tokenOverrides === null
          ? Prisma.DbNull
          : (tokenOverrides as Prisma.InputJsonValue),
      rsvpOptions: rsvpOptions as object,
      events: events as object[],
      stories: stories as object[],
      gallery: gallery as string[],
      stickers: stickers as string[],
      gifts: gifts as object[],
    },
  });

  return { success: true };
}
