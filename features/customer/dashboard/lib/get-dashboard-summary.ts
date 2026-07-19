import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { buildGuestSummary } from "@/features/guest/lib/summary";
import type { RsvpResponse } from "@/generated/prisma/enums";
import type { DashboardSummary } from "../types/dashboard.type";
import { findNextEventDate } from "./next-event";

function buildEmptySummary(): DashboardSummary {
  return {
    hasInvitation: false,
    invitation: { coupleName: "", isPublished: false, slug: "", nextEventDate: null },
    guests: {
      invited: 0,
      accepted: 0,
      maybe: 0,
      declined: 0,
      pending: 0,
      unregistered: 0,
      attendingHeadcount: 0,
    },
    sentCount: 0,
    wishes: { pendingCount: 0, recent: [] },
  };
}

/**
 * Aggregate everything the user dashboard shows in one parallel batch.
 * Read-only; auth is the caller's responsibility (page passes user.id from
 * authIsRequired()). No invitation yet is a normal state, not an error.
 */
export async function getDashboardSummary(
  userId: string,
): Promise<DashboardSummary> {
  const invitation = await prisma.invitation.findUnique({
    where: { userId },
    select: {
      id: true,
      slug: true,
      isPublished: true,
      isBrideFirst: true,
      brideNickname: true,
      groomNickname: true,
      events: true,
    },
  });
  if (!invitation) return buildEmptySummary();

  const invitationId = invitation.id;
  // wish bukan null dan bukan string kosong
  const hasWish: Prisma.GuestRsvpWhereInput = { NOT: [{ wish: null }, { wish: "" }] };

  const [
    invited,
    byResponse,
    registeredResponded,
    unregistered,
    accepted,
    sentCount,
    recentRows,
    pendingCount,
  ] = await Promise.all([
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
    prisma.guest.count({ where: { invitationId, sentAt: { not: null } } }),
    prisma.guestRsvp.findMany({
      where: { invitationId, ...hasWish },
      select: { id: true, name: true, wish: true, response: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.guestRsvp.count({
      where: { invitationId, moderationStatus: "PENDING", ...hasWish },
    }),
  ]);

  const countOf = (r: RsvpResponse) =>
    byResponse.find((b) => b.response === r)?._count._all ?? 0;

  const pair = invitation.isBrideFirst
    ? [invitation.brideNickname, invitation.groomNickname]
    : [invitation.groomNickname, invitation.brideNickname];

  return {
    hasInvitation: true,
    invitation: {
      coupleName: pair.filter(Boolean).join(" & "),
      isPublished: invitation.isPublished,
      slug: invitation.slug,
      nextEventDate: findNextEventDate(invitation.events),
    },
    guests: buildGuestSummary({
      invited,
      registeredResponded,
      acceptedCount: countOf("ACCEPT"),
      maybeCount: countOf("MAYBE"),
      declinedCount: countOf("DECLINE"),
      attendingHeadcount: accepted._sum.guests ?? 0,
      unregistered,
    }),
    sentCount,
    wishes: {
      pendingCount,
      recent: recentRows.map((r) => ({
        id: r.id,
        name: r.name,
        wish: r.wish ?? "",
        response: r.response,
        createdAt: r.createdAt.toISOString(),
      })),
    },
  };
}
