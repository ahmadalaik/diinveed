import { describe, it, expect } from "vitest";
import {
  computeDelta,
  buildRevenueTrend,
  buildPaymentBreakdown,
} from "../dashboard-helpers";

describe("computeDelta", () => {
  it("returns flat with null pct when both zero", () => {
    expect(computeDelta(0, 0)).toEqual({ pct: null, direction: "flat" });
  });

  it("returns +100% up when previous is zero and current positive", () => {
    expect(computeDelta(500, 0)).toEqual({ pct: 100, direction: "up" });
  });

  it("computes positive percentage growth", () => {
    expect(computeDelta(150, 100)).toEqual({ pct: 50, direction: "up" });
  });

  it("computes negative percentage and rounds", () => {
    const result = computeDelta(80, 100);
    expect(result.direction).toBe("down");
    expect(result.pct).toBe(-20);
  });

  it("returns flat when equal and non-zero", () => {
    expect(computeDelta(100, 100)).toEqual({ pct: 0, direction: "flat" });
  });
});

describe("buildRevenueTrend", () => {
  const now = new Date("2026-06-10T12:00:00.000Z");

  it("always returns exactly `days` sequential UTC dates ending today", () => {
    const trend = buildRevenueTrend([], 30, now);
    expect(trend).toHaveLength(30);
    expect(trend[0].date).toBe("2026-05-12");
    expect(trend[29].date).toBe("2026-06-10");
    expect(trend.every((p) => p.revenue === 0)).toBe(true);
  });

  it("sums finalAmount into the matching UTC day bucket", () => {
    const trend = buildRevenueTrend(
      [
        { createdAt: new Date("2026-06-10T01:00:00.000Z"), finalAmount: 1000 },
        { createdAt: new Date("2026-06-10T20:00:00.000Z"), finalAmount: 500 },
        { createdAt: new Date("2026-06-09T05:00:00.000Z"), finalAmount: 250 },
      ],
      30,
      now
    );
    expect(trend[29]).toEqual({ date: "2026-06-10", revenue: 1500 });
    expect(trend[28]).toEqual({ date: "2026-06-09", revenue: 250 });
  });

  it("ignores rows outside the window", () => {
    const trend = buildRevenueTrend(
      [{ createdAt: new Date("2026-04-01T00:00:00.000Z"), finalAmount: 9999 }],
      30,
      now
    );
    expect(trend.reduce((s, p) => s + p.revenue, 0)).toBe(0);
  });
});

describe("buildPaymentBreakdown", () => {
  it("maps method to label and sorts by count desc", () => {
    const result = buildPaymentBreakdown([
      { method: "qris", count: 2 },
      { method: "bank_transfer", count: 5 },
    ]);
    expect(result).toEqual([
      { method: "bank_transfer", label: "Tansfer Bank", count: 5 },
      { method: "qris", label: "QRIS", count: 2 },
    ]);
  });

  it("falls back to raw method when label is unknown", () => {
    const result = buildPaymentBreakdown([{ method: "unknown", count: 1 }]);
    expect(result[0].label).toBe("unknown");
  });
});
