import { customAlphabet } from "nanoid";

const TOKEN_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoidToken = customAlphabet(TOKEN_ALPHABET, 8);

/** Lowercase, strip non-alphanumerics, collapse to single hyphens, trim. */
export function slugifyName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "citra-dan-rama" from bride/groom names, ordered by isBrideFirst. */
export function buildCoupleSlug(
  brideName: string,
  groomName: string,
  isBrideFirst: boolean,
): string {
  const first = isBrideFirst ? brideName : groomName;
  const second = isBrideFirst ? groomName : brideName;
  const joined = [first, second]
    .map((n) => n.trim())
    .filter(Boolean)
    .join(" dan ");
  return slugifyName(joined);
}

/** Unguessable opaque id (default 8 chars, lowercase alphanumeric, bias-free via nanoid). */
export function generatePublicToken(length = 8): string {
  return nanoidToken(length);
}

/** Compose the public URL path segment. */
export function buildInvitationSlug(slug: string, publicToken: string): string {
  return slug ? `${slug}-${publicToken}` : publicToken;
}

/** Extract the publicToken (substring after the final hyphen) for lookup. */
export function parsePublicToken(invitationSlug: string): string {
  const idx = invitationSlug.lastIndexOf("-");
  return idx === -1 ? invitationSlug : invitationSlug.slice(idx + 1);
}
