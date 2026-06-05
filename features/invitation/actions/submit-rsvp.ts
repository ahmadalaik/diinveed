"use server";

import prisma from "@/lib/prisma";
import { rsvpFormSchema, RsvpFormType } from "../schemas/rsvp.schema";

type FieldErrors = Partial<Record<keyof RsvpFormType | "_form", string[]>>;

type Result =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function submitRsvp(
  token: string,
  input: RsvpFormType,
): Promise<Result> {
  const parsed = rsvpFormSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as FieldErrors };
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    select: { id: true, isPublished: true },
  });

  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };
  if (!invitation.isPublished)
    return { errors: { _form: ["Undangan belum dipublikasikan"] } };

  const { name, phoneNumber, response, guests, hope } = parsed.data;

  await prisma.guestRsvp.create({
    data: {
      invitationId: invitation.id,
      name,
      phoneNumber,
      response,
      guests: parseInt(guests || "1"),
      hope: hope,
    },
  });

  return { success: true };
}
