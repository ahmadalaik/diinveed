"use server";

import { homeRouteForRole } from "@/types/role.type";
import {
  ACTION_MESSAGES,
  ActionResponse,
  fail,
  ok,
} from "@/lib/action-response";
import { getCurrentUser } from "../utils/session";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function loginAction(): Promise<
  ActionResponse<{ redirectTo: string }>
> {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Pengguna tidak ditemukan");

    if (user.status !== "active") {
      const headersList = await headers();
      await auth.api.signOut({ headers: headersList });
      return fail("Akun tidak aktif, Silahkan kontak admin");
    }

    await logAudit({
      actorId: user.id,
      actorLabel: user.name,
      action: "auth.login",
    });

    return ok("Login berhasil", { redirectTo: homeRouteForRole(user.role) });
  } catch (error) {
    console.log("Login action error: ", error);

    return fail(ACTION_MESSAGES.SERVER_ERROR);
  }
}
