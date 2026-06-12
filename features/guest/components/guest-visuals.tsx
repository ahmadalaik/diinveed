import { CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
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
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
    chart: "oklch(58% 0.14 155)",
  },
  mungkin: {
    label: "Mungkin",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
    chart: "oklch(72% 0.15 75)",
  },
  "tidak-hadir": {
    label: "Tidak hadir",
    badge: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    dot: "bg-red-500",
    chart: "oklch(58% 0.18 25)",
  },
  menunggu: {
    label: "Menunggu",
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/50",
    chart: "oklch(80% 0.01 100)",
  },
};

export function StatusBadge({
  statusKey,
  label,
  className,
}: {
  statusKey: GuestStatusKey;
  /** Optional override (e.g. precise "Belum dikirim" vs grouped "Menunggu"). */
  label?: string;
  className?: string;
}) {
  const m = GROUP_META[STATUS_GROUP[statusKey]];
  return (
    <Badge className={cn("gap-1.5", m.badge, className)}>
      <span className={cn("size-1.5 rounded-full", m.dot)} />
      {label ?? m.label}
    </Badge>
  );
}

/** WhatsApp send indicator — DB only tracks sentAt, so: terkirim | belum. */
export function SendIndicator({ sentAt }: { sentAt: Date | null }) {
  if (!sentAt)
    return (
      <span className="text-muted-foreground/70 flex items-center gap-1.5 text-xs">
        <Clock className="size-3" /> Belum dikirim
      </span>
    );
  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <CheckCheck className="size-3.5 text-sky-500" /> {relativeTime(sentAt)}
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
        className="fill-foreground font-mono text-2xl font-medium"
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
