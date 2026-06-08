"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { publishReadySchema } from "../schemas/invitation.schema";
import { buildCoupleSlug, buildInvitationSlug } from "../lib/slug";

type FieldErrors = Partial<Record<string, string[]>>;

type PublishResult =
  | { errors: FieldErrors; invitationSlug?: undefined }
  | { errors?: undefined; invitationSlug: string };

type UnpublishResult =
  | { errors: { _form: string[] }; success?: undefined }
  | { errors?: undefined; success: true };

export async function publishInvitation(): Promise<PublishResult> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
  });
  if (!invitation) return { errors: { _form: ["Invitation not found"] } };

  const check = publishReadySchema.safeParse(invitation);
  if (!check.success) {
    return { errors: check.error.flatten().fieldErrors };
  }

  const slug =
    invitation.slug ||
    buildCoupleSlug(
      invitation.brideName,
      invitation.groomName,
      invitation.isBrideFirst,
    );

  const updated = await prisma.invitation.update({
    where: { userId: user.id },
    data: { isPublished: true, slug },
    select: { slug: true, publicToken: true },
  });

  return {
    invitationSlug: buildInvitationSlug(updated.slug, updated.publicToken),
  };
}

export async function unpublishInvitation(): Promise<UnpublishResult> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  await prisma.invitation.update({
    where: { userId: user.id },
    data: { isPublished: false },
  });

  return { success: true };
}
