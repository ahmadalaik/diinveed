"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { DEFAULT_PER_PAGE, getTotalPages } from "@/lib/pagination";
import type { UnregisteredRsvp } from "../types/guest.type";

type Params = { page?: number };

type Result =
  | { errors: { _form: string[] }; rows?: undefined }
  | {
      errors?: undefined;
      rows: UnregisteredRsvp[];
      total: number;
      totalPages: number;
      page: number;
    };

export async function getUnregisteredRsvps(params: Params): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const page = params.page && params.page > 0 ? params.page : 1;
  const where = { invitationId: invitation.id, guestId: null };

  const [rows, total] = await Promise.all([
    prisma.guestRsvp.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
    }),
    prisma.guestRsvp.count({ where }),
  ]);

  const mapped: UnregisteredRsvp[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    phoneNumber: r.phoneNumber,
    response: r.response,
    guests: r.guests,
    wish: r.wish,
    createdAt: r.createdAt,
  }));

  return {
    rows: mapped,
    total,
    totalPages: getTotalPages(total, DEFAULT_PER_PAGE),
    page,
  };
}
