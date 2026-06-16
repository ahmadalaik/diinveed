"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import { GuestRsvpRow } from "../types/invitation.type";
import prisma from "@/lib/prisma";

type Result =
  | { errors: { _form: string[] }; responses?: undefined }
  | { errors?: undefined; responses: GuestRsvpRow[] };

export async function getRsvpResponses(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const responses = await prisma.guestRsvp.findMany({
    where: { invitationId: invitation.id },
    orderBy: { submittedAt: "desc" },
  });

  return { responses: responses as unknown as GuestRsvpRow[] };
}
