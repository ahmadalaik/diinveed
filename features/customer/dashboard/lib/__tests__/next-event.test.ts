import { describe, expect, it } from "vitest";
import { daysUntil, findNextEventDate } from "../next-event";

// 10 Jun 2026 (waktu lokal) sebagai "hari ini" di semua test
const now = new Date(2026, 5, 10, 12, 0, 0);

describe("findNextEventDate", () => {
  it("returns null for empty or non-array input", () => {
    expect(findNextEventDate([], now)).toBeNull();
    expect(findNextEventDate(null, now)).toBeNull();
    expect(findNextEventDate("oops", now)).toBeNull();
  });

  it("returns null when all events are in the past", () => {
    expect(
      findNextEventDate([{ date: "2026-06-01" }, { date: "2025-12-31" }], now),
    ).toBeNull();
  });

  it("picks the nearest upcoming date among many", () => {
    expect(
      findNextEventDate(
        [{ date: "2026-08-01" }, { date: "2026-07-12" }, { date: "2026-06-01" }],
        now,
      ),
    ).toBe("2026-07-12");
  });

  it("counts today as upcoming", () => {
    expect(findNextEventDate([{ date: "2026-06-10" }], now)).toBe("2026-06-10");
  });

  it("skips invalid or empty dates", () => {
    expect(
      findNextEventDate([{ date: "not-a-date" }, { date: "" }, {}], now),
    ).toBeNull();
  });
});

describe("daysUntil", () => {
  it("counts calendar days from now to the date", () => {
    expect(daysUntil("2026-06-12", now)).toBe(2);
    expect(daysUntil("2026-06-10", now)).toBe(0);
  });

  it("returns null for invalid date", () => {
    expect(daysUntil("not-a-date", now)).toBeNull();
    expect(daysUntil("", now)).toBeNull();
  });
});
