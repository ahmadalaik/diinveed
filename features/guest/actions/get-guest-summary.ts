"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { buildGuestSummary } from "../lib/summary";
import type { GuestSummary } from "../types/guest.type";

type Result =
  | { errors: { _form: string[] }; summary?: undefined }
  | { errors?: undefined; summary: GuestSummary };

export async function getGuestSummary(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const invitationId = invitation.id;

  const [invited, byResponse, registeredResponded, unregistered, accepted] =
    await Promise.all([
      prisma.guest.count({ where: { invitationId } }),
      prisma.guestRsvp.groupBy({
        by: ["response"],
        where: { invitationId },
        _count: { _all: true },
      }),
      prisma.guestRsvp.count({ where: { invitationId, guestId: { not: null } } }),
      prisma.guestRsvp.count({ where: { invitationId, guestId: null } }),
      prisma.guestRsvp.aggregate({
        where: { invitationId, response: "ACCEPT" },
        _sum: { guests: true },
      }),
    ]);

  const countOf = (r: "ACCEPT" | "MAYBE" | "DECLINE") =>
    byResponse.find((b) => b.response === r)?._count._all ?? 0;

  return {
    summary: buildGuestSummary({
      invited,
      registeredResponded,
      acceptedCount: countOf("ACCEPT"),
      maybeCount: countOf("MAYBE"),
      declinedCount: countOf("DECLINE"),
      attendingHeadcount: accepted._sum.guests ?? 0,
      unregistered,
    }),
  };
}
