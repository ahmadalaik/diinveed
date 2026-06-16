import { slugifyName } from "@/features/invitation/lib/slug";

/** Deterministic per-invitation URL key for a guest. Empty result means the name is not URL-usable. */
export function buildGuestSlug(name: string): string {
  return slugifyName(name);
}
