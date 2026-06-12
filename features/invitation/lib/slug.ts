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

/** "citra-rama" from bride/groom nicknames, ordered by isBrideFirst. */
export function buildCoupleSlug(
  brideNickname: string,
  groomNickname: string,
  isBrideFirst: boolean,
): string {
  const first = isBrideFirst ? brideNickname : groomNickname;
  const second = isBrideFirst ? groomNickname : brideNickname;
  const joined = [first, second]
    .map((n) => n.trim())
    .filter(Boolean)
    .join(" ");
  return slugifyName(joined);
}

/** Unguessable opaque id (default 8 chars, lowercase alphanumeric, bias-free via nanoid). */
export function generatePublicToken(length = 8): string {
  return nanoidToken(length);
}

