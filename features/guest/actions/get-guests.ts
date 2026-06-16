"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { DEFAULT_PER_PAGE, getTotalPages } from "@/lib/pagination";
import { buildGuestWhere, type GuestFilters } from "../lib/guest-where";
import type { GuestWithRsvp } from "../types/guest.type";

type Params = GuestFilters & { page?: number };

type Result =
  | {
      errors: { _form: string[] };
      guests?: undefined;
    }
  | {
      errors?: undefined;
      guests: GuestWithRsvp[];
      total: number;
      totalPages: number;
      page: number;
      invitationSlug: string;
    };

export async function getGuests(params: Params): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true, slug: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const page = params.page && params.page > 0 ? params.page : 1;
  const where = buildGuestWhere(invitation.id, params);

  const [rows, total] = await Promise.all([
    prisma.guest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      select: {
        id: true,
        slug: true,
        name: true,
        phoneNumber: true,
        invitedCount: true,
        category: true,
        sentAt: true,
        rsvps: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { response: true, guests: true, wish: true, createdAt: true },
        },
      },
    }),
    prisma.guest.count({ where }),
  ]);

  const guests: GuestWithRsvp[] = rows.map((g) => ({
    id: g.id,
    slug: g.slug,
    name: g.name,
    phoneNumber: g.phoneNumber,
    invitedCount: g.invitedCount,
    category: g.category,
    sentAt: g.sentAt,
    rsvp: g.rsvps[0] ?? null,
  }));

  return {
    guests,
    total,
    totalPages: getTotalPages(total, DEFAULT_PER_PAGE),
    page,
    invitationSlug: invitation.slug,
  };
}
