import { differenceInCalendarDays } from "date-fns";
import { toDateTime } from "@/features/invitation/lib/datetime";

/**
 * From the invitation's `events` JSON, return the `YYYY-MM-DD` date of the
 * nearest event today or later, or null when there is none. Input is treated
 * as untrusted JSON, so anything malformed is skipped.
 */
export function findNextEventDate(
  events: unknown,
  now: Date = new Date(),
): string | null {
  if (!Array.isArray(events)) return null;

  let best: { date: string; parsed: Date } | null = null;
  for (const item of events) {
    const date =
      typeof (item as { date?: unknown })?.date === "string"
        ? ((item as { date: string }).date)
        : "";
    const parsed = toDateTime(date);
    if (!parsed) continue;
    if (differenceInCalendarDays(parsed, now) < 0) continue;
    if (!best || parsed < best.parsed) best = { date, parsed };
  }
  return best?.date ?? null;
}

/** Calendar days from `now` to a `YYYY-MM-DD` date; null when invalid. */
export function daysUntil(date: string, now: Date = new Date()): number | null {
  const parsed = toDateTime(date);
  return parsed ? differenceInCalendarDays(parsed, now) : null;
}