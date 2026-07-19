import { type PageSearchParams } from "@/lib/pagination";
import type { GuestSummary } from "../types/guest.type";
import { GROUP_META, StatusGroup } from "./guest-visuals";
import { Pie, PieChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { cn } from "@/lib/utils";

const chartConfig = {
  value: {
    label: "Tamu",
  },
  hadir: {
    label: "Hadir",
    color: GROUP_META.hadir.chart,
  },
  mungkin: {
    label: "Mungkin",
    color: GROUP_META.mungkin.chart,
  },
  "tidak-hadir": {
    label: "Tidak hadir",
    color: GROUP_META["tidak-hadir"].chart,
  },
  menunggu: {
    label: "Menunggu",
    color: GROUP_META.menunggu.chart,
  },
} satisfies ChartConfig;

interface Props {
  summary: GuestSummary;
  searchParams: PageSearchParams;
  tab: "guests" | "unregistered";
}

export function GuestSummaryCard({ summary }: Props) {
  const donutData = [
    { label: "Hadir", value: summary.accepted, color: GROUP_META.hadir.chart },
    { label: "Mungkin", value: summary.maybe, color: GROUP_META.mungkin.chart },
    {
      label: "Tidak hadir",
      value: summary.declined,
      color: GROUP_META["tidak-hadir"].chart,
    },
    {
      label: "Menunggu",
      value: summary.pending,
      color: GROUP_META.menunggu.chart,
    },
  ];

  const chartData = [
    { status: "hadir", value: summary.accepted, fill: "var(--color-hadir)" },
    { status: "mungkin", value: summary.maybe, fill: "var(--color-mungkin)" },
    {
      status: "tidak-hadir",
      value: summary.declined,
      fill: "var(--color-tidak-hadir)",
    },
    {
      status: "menunggu",
      value: summary.pending,
      fill: "var(--color-menunggu)",
    },
  ];

  const isEmpty = summary.invited === 0;
  const displayData = isEmpty
    ? [{ status: "empty", value: 1, fill: "var(--color-menunggu)" }]
    : chartData;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
      {/* Card 1: RSVP Breakdown */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-[6px] rounded-[2rem] border border-zinc-200/80 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5">
        <div className="bg-background p-6 rounded-[calc(2rem-6px)] shadow-[0_2px_8px_rgba(9,9,11,0.01)] border border-black/5 flex flex-col justify-between h-full">
          <span className="font-mono text-[11px] font-bold text-zinc-400 tracking-widest uppercase">
            Statistik Kehadiran
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-3">
            <div className="relative size-[120px] shrink-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square size-[120px]"
              >
                <PieChart>
                  {!isEmpty && (
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                  )}
                  <Pie
                    data={displayData}
                    dataKey="value"
                    nameKey="status"
                    innerRadius={45}
                    outerRadius={60}
                    strokeWidth={0}
                    paddingAngle={0}
                  />
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-zinc-900 dark:text-white leading-none">
                  {summary.invited}
                </span>
                <span className="text-[9.5px] font-bold text-zinc-400 tracking-wider uppercase mt-0.5">
                  Tamu
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1.5 w-full">
              {donutData.map((d) => {
                const pct =
                  summary.invited > 0
                    ? Math.round((d.value / summary.invited) * 100)
                    : 0;
                const key = (
                  d.label === "Tidak hadir"
                    ? "tidak-hadir"
                    : d.label.toLowerCase()
                ) as StatusGroup;
                const badgeClasses = GROUP_META[key]?.badge;
                const dotColor = GROUP_META[key]?.dot;
                return (
                  <div key={d.label} className="flex items-center text-[13px]">
                    <span
                      className={cn("w-1.5 h-3.5 rounded-full mr-2", dotColor)}
                    />
                    <span className="text-zinc-500 flex-1 font-medium">
                      {d.label}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 mr-2">
                      {d.value}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "h-auto w-10 justify-center rounded text-[11.5px] font-bold text-center border-0",
                        badgeClasses,
                      )}
                    >
                      {pct}%
                    </Badge>
                  </div>
                );
              })}
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-zinc-500 font-medium">
                  Total tamu hadir:
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {summary.attendingHeadcount}{" "}
                  <span className="text-[10px] font-normal text-zinc-400 ml-0.5">
                    pax
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Total Invited */}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 p-[6px] rounded-[2rem] border border-zinc-200/80 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5">
        <div className="bg-background p-6 rounded-[calc(2rem-6px)] shadow-[0_2px_8px_rgba(9,9,11,0.01)] border border-black/5 flex flex-col justify-between h-full min-h-[160px]">
          <div>
            <span className="font-mono text-[11px] font-bold text-zinc-400 tracking-widest uppercase">
              Total Tamu Diundang
            </span>
            <div className="text-4xl font-extrabold tracking-tight mt-2 text-zinc-950 dark:text-white">
              {summary.invited}
              <span className="text-[14.5px] font-normal text-zinc-400 ml-1.5">
                Tamu
              </span>
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium border-t border-zinc-50 dark:border-zinc-800/50 pt-2 mt-4">
            Tamu yang terdaftar dalam sistem undangan
          </div>
        </div>
      </div>

      {/* Card 3: Unregistered Responses */}
      <div className="bg-rose-500/4 p-[6px] rounded-[2rem] border border-rose-500/15 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-rose-500/30 hover:shadow-md hover:-translate-y-0.5">
        <div className="bg-background p-6 rounded-[calc(2rem-6px)] shadow-[0_2px_8px_rgba(9,9,11,0.01)] border border-black/5 flex flex-col justify-between h-full min-h-[160px]">
          <div>
            <span className="font-mono text-[11px] font-bold text-rose-500 tracking-widest uppercase">
              Respon Luar (Tak Terdaftar)
            </span>
            <div className="text-4xl font-extrabold tracking-tight mt-2 text-rose-500">
              {summary.unregistered}
              <span className="text-[14.5px] font-normal text-rose-450 ml-1.5">
                Respon
              </span>
            </div>
          </div>
          <div className="text-xs text-rose-500 font-medium border-t border-rose-500/10 pt-2 mt-4">
            Tamu luar yang mengisi form RSVP langsung
          </div>
        </div>
      </div>
    </div>
  );
}
