"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { buildGuestSlug } from "../lib/guest-slug";
import { guestFormSchema, GuestFormType } from "../schemas/guest.schema";
import {
  ok,
  fail,
  validationError,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function createGuest(
  input: GuestFormType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = guestFormSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return fail("Undangan tidak ditemukan");

  const slug = buildGuestSlug(parsed.data.name);
  if (!slug) {
    return fail("Nama tamu tidak valid untuk dijadikan URL", {
      name: ["Nama tamu tidak valid untuk dijadikan URL"],
    });
  }

  const taken = await prisma.guest.findFirst({
    where: { invitationId: invitation.id, slug },
    select: { id: true },
  });
  if (taken) {
    return fail(
      "Nama tamu sudah ada, tambahkan pembeda (mis. Budi SMA, Budi Univ)",
      {
        name: ["Nama tamu sudah ada, tambahkan pembeda (mis. Budi SMA, Budi Univ)"],
      },
    );
  }

  const created = await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      slug,
      name: parsed.data.name,
      phoneNumber: parsed.data.phoneNumber ?? null,
      invitedCount: parsed.data.invitedCount,
      category: parsed.data.category ?? null,
    },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "guest.created",
    targetType: "guest",
    targetId: created.id,
    targetLabel: parsed.data.name,
  });

  revalidatePath("/tamu");
  return ok("Tamu ditambahkan");
}
