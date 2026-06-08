"use server";

import prisma from "@/lib/prisma";
import { rsvpFormSchema, RsvpFormType } from "../schemas/rsvp.schema";

type FieldErrors = Partial<Record<keyof RsvpFormType | "_form", string[]>>;

type Result =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function submitRsvp(
  publicToken: string,
  input: RsvpFormType,
  guestSlug?: string,
): Promise<Result> {
  const parsed = rsvpFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { publicToken },
    select: { id: true, isPublished: true },
  });

  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };
  if (!invitation.isPublished)
    return { errors: { _form: ["Undangan belum dipublikasikan"] } };

  const { name, phoneNumber, response, guests, hope } = parsed.data;
  const base = {
    invitationId: invitation.id,
    name,
    phoneNumber,
    response,
    guests: parseInt(guests || "1"),
    hope,
  };

  let guestId: string | null = null;
  if (guestSlug) {
    const guest = await prisma.guest.findFirst({
      where: { slug: guestSlug, invitationId: invitation.id },
      select: { id: true },
    });
    guestId = guest?.id ?? null;
  }

  if (guestId) {
    const existing = await prisma.guestRsvp.findFirst({ where: { guestId } });
    if (existing) {
      await prisma.guestRsvp.update({ where: { id: existing.id }, data: base });
    } else {
      await prisma.guestRsvp.create({ data: { ...base, guestId } });
    }
  } else {
    await prisma.guestRsvp.create({ data: base });
  }

  return { success: true };
}
