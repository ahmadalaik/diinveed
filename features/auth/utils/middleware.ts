import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { homeRouteForRole, isAdminRole } from "@/types/role.type";

export async function authIsRequired() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function adminIsRequired() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!isAdminRole(user.role)) {
    redirect("/dashboard");
  }
  return user;
}

export async function authIsNotRequired() {
  const user = await getCurrentUser();
  if (user) {
    redirect(homeRouteForRole(user.role));
  }
}
