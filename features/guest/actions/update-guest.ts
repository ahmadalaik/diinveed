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

export async function updateGuest(
  id: string,
  input: GuestFormType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = guestFormSchema.safeParse(input);
  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const guest = await prisma.guest.findUnique({
    where: { id },
    select: { invitationId: true, invitation: { select: { userId: true } } },
  });
  if (!guest || guest.invitation.userId !== user.id) {
    return fail("Tamu tidak ditemukan");
  }

  const slug = buildGuestSlug(parsed.data.name);
  if (!slug) {
    return fail("Nama tamu tidak valid untuk dijadikan URL", {
      name: ["Nama tamu tidak valid untuk dijadikan URL"],
    });
  }

  const taken = await prisma.guest.findFirst({
    where: { invitationId: guest.invitationId, slug, id: { not: id } },
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

  await prisma.guest.update({
    where: { id },
    data: {
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
    action: "guest.updated",
    targetType: "guest",
    targetId: id,
    targetLabel: parsed.data.name,
  });

  revalidatePath("/tamu");
  return ok("Tamu diperbarui");
}
