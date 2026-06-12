"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import {
  wishesOptionsSchema,
  WishesOptionsType,
} from "../schemas/wish.schema";
import {
  ok,
  fail,
  ACTION_MESSAGES,
  type ActionResponse,
} from "@/lib/action-response";

export async function updateWishesOptions(
  input: WishesOptionsType,
): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return fail(ACTION_MESSAGES.UNAUTHORIZED);

  const parsed = wishesOptionsSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Pengaturan tidak valid");
  }

  const invitation = await prisma.invitation.update({
    where: { userId: user.id },
    data: { wishesOptions: parsed.data },
  });

  await logAudit({
    actorId: user.id,
    actorLabel: user.name ?? user.id,
    action: "invitation.wishes_options_updated",
    targetType: "invitation",
    targetId: invitation.id,
  });

  revalidatePath("/rsvp");
  return ok("Pengaturan disimpan");
}
