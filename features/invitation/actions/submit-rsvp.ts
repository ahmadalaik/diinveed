"use server";

import prisma from "@/lib/prisma";
import { submitRsvpSchema, SubmitRsvpType } from "../schemas/rsvp.schema";

type FieldErrors = Partial<Record<keyof SubmitRsvpType | "_form", string[]>>;

type Result =
  | { errors: FieldErrors; success?: undefined }
  | { errors?: undefined; success: true };

export async function submitRsvp(
  token: string,
  input: SubmitRsvpType,
): Promise<Result> {
  const parsed = submitRsvpSchema.safeParse(input);
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

  const { name, email, response, plusOne } = parsed.data;

  await prisma.guestRsvp.create({
    data: {
      invitationId: invitation.id,
      name,
      email: email ?? null,
      response,
      plusOne,
    },
  });

  return { success: true };
}
