"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../utils/session";
import { logAudit } from "@/lib/audit";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logAudit({
      actorId: user.id,
      actorLabel: user.name,
      action: "auth.logout",
    });
  }
  
  const headersList = await headers();
  await auth.api.signOut({ headers: headersList });

  redirect("/login");
}
