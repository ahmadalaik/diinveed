/**
 * Downscale an image to fit within `maxEdge` on its longest side and re-encode
 * as WebP. Runs entirely in the browser (OffscreenCanvas), so direct-to-R2
 * uploads stay small. Images already smaller than maxEdge are only re-encoded.
 */
export async function resizeToWebp(
  file: File,
  maxEdge = 2560,
  quality = 0.9,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  return canvas.convertToBlob({ type: "image/webp", quality });
}
