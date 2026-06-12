import { format } from "date-fns";
import { id } from "date-fns/locale";

/** Fixed UTC offsets for Indonesian time zones (no DST). */
export const TZ_OFFSETS: Record<string, string> = {
  WIB: "+07:00", // Asia/Jakarta
  WITA: "+08:00", // Asia/Makassar
  WIT: "+09:00", // Asia/Jayapura
};

/**
 * Combine a `YYYY-MM-DD` date, optional `HH:MM` time, and optional timezone
 * label into an absolute `Date`.
 *
 * When `timezone` maps to a known offset (WIB/WITA/WIT), the result is the exact
 * instant of that wall-clock time at the venue — identical for every viewer
 * regardless of their own zone. Without a known timezone it falls back to the
 * viewer's local time. Returns `null` when the date is missing or invalid.
 *
 * @example
 * toDateTime("2026-06-06", "16:00", "WIB") // → 2026-06-06T09:00:00Z (fixed instant)
 * toDateTime("2026-06-06", "16:00")        // → 16:00 in the viewer's local zone
 * toDateTime("")                           // → null
 */
export function toDateTime(
  date?: string,
  time?: string,
  timezone?: string,
): Date | null {
  if (!date) return null;
  const offset = timezone ? (TZ_OFFSETS[timezone] ?? "") : "";
  const result = new Date(`${date}T${time || "00:00"}:00${offset}`);
  return Number.isNaN(result.getTime()) ? null : result;
}

/**
 * Format a `YYYY-MM-DD` date string for display, parsed as a local civil date so
 * every viewer sees the same calendar day (no UTC off-by-one). Returns `""` when
 * the date is missing or invalid, so it's safe to drop straight into JSX.
 *
 * Use this for *displaying* a date label — not for computing an instant; for
 * that use {@link toDateTime} with a timezone.
 *
 * @example formatDate("2026-06-06", "PP") // → "Jun 6, 2026"
 */
export function formatDate(date: string | undefined, pattern: string): string {
  const parsed = toDateTime(date);
  return parsed ? format(parsed, pattern, { locale: id }) : "";
}
