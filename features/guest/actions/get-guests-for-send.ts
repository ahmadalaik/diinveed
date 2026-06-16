"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { buildGuestWhere, type GuestFilters } from "../lib/guest-where";
import type { GuestSendRow } from "../types/guest.type";

type Params = { ids?: string[]; filter?: GuestFilters };

type Result =
  | { errors: { _form: string[] }; guests?: undefined }
  | { errors?: undefined; guests: GuestSendRow[] };

export async function getGuestsForSend(params: Params): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const where =
    params.ids && params.ids.length > 0
      ? { invitationId: invitation.id, id: { in: params.ids } }
      : buildGuestWhere(invitation.id, params.filter ?? {});

  const guests = await prisma.guest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, phoneNumber: true, slug: true },
  });

  return { guests };
}
