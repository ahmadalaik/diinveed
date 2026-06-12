/**
 * Insert a delivery transformation into a Cloudinary URL so images are served
 * in the most efficient format (`f_auto` → AVIF/WebP per browser) at an
 * automatic quality (`q_auto`), optionally capped to a width.
 *
 * Only rewrites Cloudinary delivery URLs; anything else is returned untouched.
 *
 * @example
 * cldUrl(url)                       // .../upload/f_auto,q_auto/...
 * cldUrl(url, "f_auto,q_auto,w_800") // .../upload/f_auto,q_auto,w_800/...
 */
export function cldUrl(
  url: string | undefined | null,
  transform = "f_auto,q_auto",
): string {
  if (!url) return "";
  const marker = "/image/upload/";
  if (!url.includes(marker)) return url;
  return url.replace(marker, `${marker}${transform}/`);
}
