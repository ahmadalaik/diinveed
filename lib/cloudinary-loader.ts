"use client";

import type { ImageLoaderProps } from "next/image";

const UPLOAD_MARKER = "/image/upload/";

/**
 * A `next/image` loader that delegates optimization to Cloudinary instead of
 * the built-in `/_next/image` endpoint. It injects a delivery transformation
 * (`f_auto` → AVIF/WebP, `q_auto` → automatic quality, `c_limit,w_<width>` →
 * responsive resize) so Cloudinary serves a correctly sized, modern-format
 * image and Next.js never re-optimizes (avoiding double compression).
 *
 * Use via the per-image `loader` prop: `<Image loader={cloudinaryLoader} ... />`.
 * Pass the **raw** Cloudinary URL as `src` (no manual transform) — the width is
 * supplied by Next from the `sizes`/`width` props. Non-Cloudinary URLs (e.g.
 * Pexels) are returned untouched.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const markerIndex = src.indexOf(UPLOAD_MARKER);
  if (markerIndex === -1) return src;

  const transform = `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`;
  const insertAt = markerIndex + UPLOAD_MARKER.length;
  return `${src.slice(0, insertAt)}${transform}/${src.slice(insertAt)}`;
}
