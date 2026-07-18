import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!user) return null;

  return user;
}
