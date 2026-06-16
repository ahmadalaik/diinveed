import type { Prisma } from "@/generated/prisma/client";
import type { GuestStatusFilter } from "../types/guest.type";

export type GuestFilters = {
  q?: string;
  status?: GuestStatusFilter;
  category?: string;
};

const STATUS_RESPONSE: Record<
  Exclude<GuestStatusFilter, "menunggu">,
  "ACCEPT" | "MAYBE" | "DECLINE"
> = {
  hadir: "ACCEPT",
  mungkin: "MAYBE",
  "tidak-hadir": "DECLINE",
};

/** Build the Prisma `where` for guests of one invitation, applying optional filters. */
export function buildGuestWhere(
  invitationId: string,
  filters: GuestFilters,
): Prisma.GuestWhereInput {
  const where: Prisma.GuestWhereInput = { invitationId };

  if (filters.status === "menunggu") {
    where.rsvps = { none: {} };
  } else if (filters.status) {
    where.rsvps = { some: { response: STATUS_RESPONSE[filters.status] } };
  }

  if (filters.category) where.category = filters.category;

  const q = filters.q?.trim();
  if (q) {
    where.OR = [{ name: { contains: q } }, { phoneNumber: { contains: q } }];
  }

  return where;
}
