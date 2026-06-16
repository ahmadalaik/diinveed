"use server";

import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { rsvpFormSchema, RsvpFormType } from "../schemas/rsvp.schema";
import { DEFAULT_WISHES_OPTIONS } from "../schemas/wish.schema";
import type { WishesOptions } from "../types/invitation.type";
import {
  ok,
  fail,
  validationError,
  type ActionResponse,
} from "@/lib/action-response";

export async function submitRsvp(
  publicToken: string,
  input: RsvpFormType,
  guestSlug?: string,
): Promise<ActionResponse> {
  const parsed = rsvpFormSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { publicToken },
    select: { id: true, isPublished: true, wishesOptions: true },
  });

  if (!invitation) return fail("Undangan tidak ditemukan");
  if (!invitation.isPublished)
    return fail("Undangan belum dipublikasikan");

  const options =
    (invitation.wishesOptions as WishesOptions | null) ?? DEFAULT_WISHES_OPTIONS;

  // Resolve a registered guest first — needed for the allowPublic gate.
  let guestId: string | null = null;
  if (guestSlug) {
    const guest = await prisma.guest.findFirst({
      where: { slug: guestSlug, invitationId: invitation.id },
      select: { id: true },
    });
    guestId = guest?.id ?? null;
  }

  if (!options.allowPublic && !guestId) {
    return fail("Hanya tamu terdaftar yang dapat mengirim ucapan.");
  }

  const { name, phoneNumber, response, guests, wish } = parsed.data;
  const base = {
    invitationId: invitation.id,
    name,
    phoneNumber,
    response,
    guests: parseInt(guests || "1"),
    wish,
    moderationStatus: options.reviewMode ? "PENDING" : "APPROVED",
  } as const;

  if (guestId) {
    const existing = await prisma.guestRsvp.findFirst({ where: { guestId } });
    if (existing) {
      await prisma.guestRsvp.update({ where: { id: existing.id }, data: base });
    } else {
      await prisma.guestRsvp.create({ data: { ...base, guestId } });
    }
  } else {
    await prisma.guestRsvp.create({ data: base });
  }

  await logAudit({
    actorId: null,
    actorLabel: name ?? "Tamu",
    action: "rsvp.submitted",
    targetType: "invitation",
    targetId: invitation.id,
    metadata: { attendance: response },
  });

  return ok("Terima kasih, konfirmasi Anda terkirim");
}
