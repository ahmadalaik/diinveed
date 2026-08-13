import type { EventItem } from "../types/invitation.type";
import { toDateTime } from "./datetime";

export type CountdownSession = EventItem & {
  position: number;
  isPrimary: boolean;
};
export type CountdownSelection = { eventId: string | null; ended: boolean };

export function resolveCountdownEvent<T extends EventItem>(
  events: T[],
  countdownEventId: string | null | undefined,
): T | null {
  if (countdownEventId === undefined) return events[0] ?? null;
  if (countdownEventId === null) return null;
  return events.find(({ id }) => id === countdownEventId) ?? null;
}

export function selectCountdownEvent(
  events: CountdownSession[],
  mode: "generic" | "personal",
  now: Date,
): CountdownSelection {
  if (events.length === 0) return { eventId: null, ended: true };
  if (mode === "generic") {
    const primary = events.find((event) => event.isPrimary);
    if (!primary) return { eventId: null, ended: true };
    const start = toDateTime(primary.date, primary.timeStart, primary.timezone);
    const end = toDateTime(primary.date, primary.timeEnd, primary.timezone);
    if (!start || !end) return { eventId: null, ended: true };
    return {
      eventId: end.getTime() > now.getTime() ? primary.id : null,
      ended: end.getTime() <= now.getTime(),
    };
  }

  const ordered = events
    .map((event) => ({
      event,
      start: toDateTime(event.date, event.timeStart, event.timezone),
      end: toDateTime(event.date, event.timeEnd, event.timezone),
    }))
    .filter(
      (row): row is typeof row & { start: Date; end: Date } =>
        Boolean(row.start && row.end),
    )
    .sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        a.event.position - b.event.position,
    );
  const next = ordered.find(({ start }) => start.getTime() > now.getTime());
  if (next) return { eventId: next.event.id, ended: false };
  return {
    eventId: null,
    ended: ordered.every(({ end }) => end.getTime() <= now.getTime()),
  };
}
