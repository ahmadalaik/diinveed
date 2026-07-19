import { CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { GuestStatusKey } from "../lib/guest-status";

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: idLocale });
}

/** Coarse status group used for filter tabs, kanban columns and the donut. */
export type StatusGroup = "hadir" | "mungkin" | "tidak-hadir" | "menunggu";

export const STATUS_GROUP: Record<GuestStatusKey, StatusGroup> = {
  accepted: "hadir",
  maybe: "mungkin",
  declined: "tidak-hadir",
  "pending-sent": "menunggu",
  "pending-unsent": "menunggu",
};

export const GROUP_META: Record<
  StatusGroup,
  { label: string; badge: string; dot: string; chart: string }
> = {
  hadir: {
    label: "Hadir",
    badge:
      "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
    dot: "bg-blue-600",
    chart: "#2563eb",
  },
  mungkin: {
    label: "Mungkin",
    badge:
      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    dot: "bg-amber-500",
    chart: "#fbbf24",
  },
  "tidak-hadir": {
    label: "Tidak hadir",
    badge:
      "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
    dot: "bg-rose-500",
    chart: "#f43f5e",
  },
  menunggu: {
    label: "Menunggu",
    badge: "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    dot: "bg-zinc-300 dark:bg-zinc-600",
    chart: "#e4e4e7",
  },
};

export function StatusBadge({
  statusKey,
  label,
  className,
}: {
  statusKey: GuestStatusKey;
  label?: string;
  className?: string;
}) {
  const m = GROUP_META[STATUS_GROUP[statusKey]];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        m.badge,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {label ?? m.label}
    </div>
  );
}

/** WhatsApp send indicator — DB only tracks sentAt, so: terkirim | belum. */
export function SendIndicator({ sentAt }: { sentAt: Date | null }) {
  if (!sentAt)
    return (
      <span className="text-zinc-400 flex items-center gap-1.5 text-xs">
        <Clock className="size-3" /> Belum dikirim
      </span>
    );
  return (
    <span className="text-zinc-600 flex items-center gap-1.5 text-xs font-medium">
      <CheckCheck className="size-3.5 text-blue-600" /> Terkirim {relativeTime(sentAt)}
    </span>
  );
}

// ---- Donut chart (SVG) ----------------------------------------------------

export type DonutSlice = { label: string; value: number; color: string };

export function Donut({
  data,
  size = 168,
  thickness = 24,
  centerLabel = "Tamu",
}: {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const sliceLen = (value: number) => (value / total) * circ;

  const segments = data.map((d, i) => ({
    ...d,
    len: sliceLen(d.value),
    offset: data
      .slice(0, i)
      .reduce((sum, prev) => sum + sliceLen(prev.value) + 2, 0),
  }));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-44">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={thickness}
      />
      {segments.map((d, i) =>
        d.value > 0 ? (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={thickness}
            strokeDasharray={`${d.len} ${circ - d.len}`}
            strokeDashoffset={-d.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ) : null,
      )}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        className="fill-foreground text-2xl font-semibold tracking-tight"
      >
        {data.reduce((s, d) => s + d.value, 0)}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        className="fill-muted-foreground text-[10px] tracking-widest uppercase"
      >
        {centerLabel}
      </text>
    </svg>
  );
}
