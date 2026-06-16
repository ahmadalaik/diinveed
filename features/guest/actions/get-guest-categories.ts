"use server";

import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";

type Result =
  | { errors: { _form: string[] }; categories?: undefined }
  | { errors?: undefined; categories: string[] };

export async function getGuestCategories(): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { errors: { _form: ["Unauthorized"] } };

  const invitation = await prisma.invitation.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!invitation) return { errors: { _form: ["Undangan tidak ditemukan"] } };

  const rows = await prisma.guest.findMany({
    where: { invitationId: invitation.id, category: { not: null } },
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });

  return {
    categories: rows
      .map((r) => r.category)
      .filter((c): c is string => Boolean(c)),
  };
}
