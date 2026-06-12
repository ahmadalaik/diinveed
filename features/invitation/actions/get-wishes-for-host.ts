"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { DEFAULT_PER_PAGE, getTotalPages } from "@/lib/pagination";
import type { WishModerationStatus, WishRow } from "../types/invitation.type";

type Params = { page?: number; status?: WishModerationStatus };

type Counts = { all: number; pending: number; approved: number; hidden: number };

type Result =
  | {
      errors: { _form: string[] };
      rows?: undefined;
      total?: undefined;
      totalPages?: undefined;
      page?: undefined;
      counts?: undefined;
    }
  | {
      errors?: undefined;
      rows: WishRow[];
      total: number;
      totalPages: number;
      page: number;
      counts: Counts;
    };

export async function getWishesForHost(params: Params): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const page = params.page && params.page > 0 ? params.page : 1;
  const baseWhere = { invitationId: invitation.id, wish: { not: "" } };
  const where = params.status
    ? { ...baseWhere, moderationStatus: params.status }
    : baseWhere;

  const [rows, total, all, pending, approved, hidden] = await Promise.all([
    prisma.guestRsvp.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      include: { guest: { select: { category: true } } },
    }),
    prisma.guestRsvp.count({ where }),
    prisma.guestRsvp.count({ where: baseWhere }),
    prisma.guestRsvp.count({ where: { ...baseWhere, moderationStatus: "PENDING" } }),
    prisma.guestRsvp.count({ where: { ...baseWhere, moderationStatus: "APPROVED" } }),
    prisma.guestRsvp.count({ where: { ...baseWhere, moderationStatus: "HIDDEN" } }),
  ]);

  const mapped: WishRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    wish: r.wish ?? "",
    response: r.response,
    guests: r.guests,
    category: r.guest?.category ?? null,
    moderationStatus: r.moderationStatus,
    createdAt: r.createdAt,
  }));

  return {
    rows: mapped,
    total,
    totalPages: getTotalPages(total, DEFAULT_PER_PAGE),
    page,
    counts: { all, pending, approved, hidden },
  };
}
