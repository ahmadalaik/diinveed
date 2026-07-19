import { PAYMENT_METHOD_LABELS } from "@/features/transaction/utils/format";

export type Delta = {
  pct: number | null;
  direction: "up" | "down" | "flat";
};

export type RevenuePoint = { date: string; revenue: number };

export type PaymentSlice = { method: string; label: string; count: number };

/** Persentase perubahan current vs previous, dibulatkan ke bilangan bulat. */
export function computeDelta(current: number, previous: number): Delta {
  if (previous === 0) {
    if (current === 0) return { pct: null, direction: "flat" };
    return { pct: 100, direction: "up" };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  const direction = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return { pct, direction };
}

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Bangun deret `days` titik berurutan (berbasis UTC) yang berakhir pada hari `now`,
 * menjumlahkan finalAmount ke bucket harinya. Hari tanpa data terisi 0.
 */
export function buildRevenueTrend(
  rows: { createdAt: Date; finalAmount: number }[],
  days: number,
  now: Date
): RevenuePoint[] {
  const buckets = new Map<string, number>();
  const points: RevenuePoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = toUtcDateKey(d);
    buckets.set(key, 0);
    points.push({ date: key, revenue: 0 });
  }

  for (const row of rows) {
    const key = toUtcDateKey(row.createdAt);
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + row.finalAmount);
    }
  }

  return points.map((p) => ({ date: p.date, revenue: buckets.get(p.date)! }));
}

/** Tambah label ke tiap metode pembayaran dan urutkan dari count terbesar. */
export function buildPaymentBreakdown(
  rows: { method: string; count: number }[]
): PaymentSlice[] {
  return rows
    .map((r) => ({
      method: r.method,
      label: PAYMENT_METHOD_LABELS[r.method] ?? r.method,
      count: r.count,
    }))
    .sort((a, b) => b.count - a.count);
}
