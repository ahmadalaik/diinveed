import type { UserRole } from "@/generated/prisma/enums";

type Actor = { id: string; role: UserRole };
export type Target = { id: string; role: UserRole };

export function getManagedRoles(actorRole: UserRole): UserRole[] {
  if (actorRole === "super_admin") return ["user", "admin", "super_admin"];
  if (actorRole === "admin") return ["user"];
  return [];
}

export function canViewUser(actorRole: UserRole, targetRole: UserRole): boolean {
  return getManagedRoles(actorRole).includes(targetRole);
}

export function canManageUser(actor: Actor, target: Target): boolean {
  if (actor.id === target.id) return false;
  return canViewUser(actor.role, target.role);
}

export function getAllowedRoles(actorRole: UserRole): UserRole[] {
  return getManagedRoles(actorRole);
}
