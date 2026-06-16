"use server";

import prisma from "@/lib/prisma";
import { DEFAULT_PER_PAGE, getTotalPages } from "@/lib/pagination";
import { DEFAULT_WISHES_OPTIONS } from "../schemas/wish.schema";
import type { PublicWish, WishesOptions } from "../types/invitation.type";

type Result =
  | {
      errors: { _form: string[] };
      wishes?: undefined;
      total?: undefined;
      totalPages?: undefined;
      page?: undefined;
      showCategory?: undefined;
    }
  | {
      errors?: undefined;
      wishes: PublicWish[];
      total: number;
      totalPages: number;
      page: number;
      showCategory: boolean;
    };

export async function getPublicWishes(
  publicToken: string,
  page = 1,
): Promise<Result> {
  const invitation = await prisma.invitation.findUnique({
    where: { publicToken },
    select: { id: true, isPublished: true, wishesOptions: true },
  });
  if (!invitation || !invitation.isPublished)
    return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const options =
    (invitation.wishesOptions as WishesOptions | null) ?? DEFAULT_WISHES_OPTIONS;

  if (!options.enabled)
    return { wishes: [], total: 0, totalPages: 1, page: 1, showCategory: false };

  const current = page > 0 ? page : 1;
  const where = {
    invitationId: invitation.id,
    moderationStatus: "APPROVED" as const,
    wish: { not: "" },
  };

  const [rows, total] = await Promise.all([
    prisma.guestRsvp.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (current - 1) * DEFAULT_PER_PAGE,
      take: DEFAULT_PER_PAGE,
      include: { guest: { select: { category: true } } },
    }),
    prisma.guestRsvp.count({ where }),
  ]);

  const wishes: PublicWish[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    wish: r.wish ?? "",
    category: r.guest?.category ?? null,
    createdAt: r.createdAt,
  }));

  return {
    wishes,
    total,
    totalPages: getTotalPages(total, DEFAULT_PER_PAGE),
    page: current,
    showCategory: options.showCategory,
  };
}
