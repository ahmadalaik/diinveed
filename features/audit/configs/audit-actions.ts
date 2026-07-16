import { AUDIT_ACTIONS, auditActionDomain, type AuditAction } from "@/lib/audit-actions";

export { AUDIT_ACTIONS, auditActionDomain };
export type { AuditAction };

export const AUDIT_ACTION_OPTIONS = (
  Object.entries(AUDIT_ACTIONS) as [AuditAction, string][]
).map(([value, label]) => ({ value, label }));

export const DOMAIN_BADGE_CLASS: Record<string, string> = {
  auth: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  transaction: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  template: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  invitation: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  wish: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  rsvp: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200",
  guest: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
  guest_template: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200",
  other: "bg-muted text-muted-foreground",
};

export function actionLabel(action: string): string {
  return (AUDIT_ACTIONS as Record<string, string>)[action] ?? action;
}

export function domainBadgeClass(action: string): string {
  return DOMAIN_BADGE_CLASS[auditActionDomain(action)] ?? DOMAIN_BADGE_CLASS.other;
}
