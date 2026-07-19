export const LIGHTBOX_MIN_ZOOM = 50;
export const LIGHTBOX_MAX_ZOOM = 200;
export const LIGHTBOX_ZOOM_STEP = 25;
export const LIGHTBOX_DEFAULT_ZOOM = 100;

export function getLoopedLightboxIndex(
  currentIndex: number,
  direction: number,
  total: number,
) {
  if (total <= 0) return 0;
  return (currentIndex + direction + total) % total;
}

export function clampLightboxZoom(zoom: number) {
  return Math.min(Math.max(zoom, LIGHTBOX_MIN_ZOOM), LIGHTBOX_MAX_ZOOM);
}

export function formatLightboxCounter(currentIndex: number, total: number) {
  return `${currentIndex + 1} / ${total}`;
}
