"use client";

import * as React from "react";
import { Pie, PieChart } from "recharts";
import type { GuestSummary } from "@/features/guest/types/guest.type";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  accepted: {
    label: "Accepted",
    color: "#2563eb", // blue-600
  },
  declined: {
    label: "Declined",
    color: "#f43f5e", // rose-500
  },
  maybe: {
    label: "Maybe",
    color: "#fbbf24", // amber-400
  },
  pending: {
    label: "Pending",
    color: "#d4d4d8", // zinc-300
  },
};

export function RsvpBreakdownCard({ guests }: { guests: GuestSummary }) {
  const chartData = React.useMemo(
    () => [
      { status: "accepted", count: guests.accepted, fill: "#2563eb" },
      { status: "declined", count: guests.declined, fill: "#f43f5e" },
      { status: "maybe", count: guests.maybe, fill: "#fbbf24" },
      { status: "pending", count: guests.pending, fill: "#e4e4e7" },
    ],
    [guests],
  );

  const totalGuests = React.useMemo(() => {
    return guests.accepted + guests.declined + guests.maybe + guests.pending;
  }, [guests]);

  const isEmpty = totalGuests === 0;
  const displayData = isEmpty
    ? [{ status: "pending", count: 1, fill: "#f4f4f5" }]
    : chartData;

  const getPercentage = (count: number) => {
    if (totalGuests === 0) return 0;
    return Math.round((count / totalGuests) * 100);
  };

  return (
    <div className="double-bezel-outer">
      <div className="double-bezel-inner flex flex-col justify-between">
        <div>
          <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase font-semibold">
            RASIO RSVP TAMU
          </span>
          <h3 className="text-lg font-bold text-zinc-950 mt-0.5">
            RSVP Breakdown
          </h3>
        </div>

        {/* Donut Chart with Total RSVP in the center */}
        <div className="relative flex items-center justify-center my-6">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[180px] w-full"
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
                dataKey="count"
                nameKey="status"
                innerRadius={55}
                outerRadius={75}
                strokeWidth={0}
                paddingAngle={0}
              />
            </PieChart>
          </ChartContainer>

          {/* Center text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold">
              Total
            </span>
            <span className="text-3xl font-extrabold font-mono text-zinc-950">
              {isEmpty ? 0 : totalGuests}
            </span>
            <span className="text-[9px] text-zinc-400 font-sans mt-0.5">
              Jawaban
            </span>
          </div>
        </div>

        {/* Headcount section */}
        <div className="mb-4 p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-sans font-medium">
            Estimasi Kedatangan
          </span>
          <span className="font-mono font-bold text-zinc-950 text-sm bg-white border border-zinc-200 px-2.5 py-1 rounded-lg">
            {guests.attendingHeadcount} Orang
          </span>
        </div>

        {/* Custom Clean Legend List */}
        <div className="flex flex-col gap-2.5">
          {/* Item 1: Accepted (Cobalt Blue) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 rounded-full bg-blue-600"></div>
              <span className="font-semibold text-zinc-700">Accepted</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold font-mono text-zinc-900">
                {guests.accepted}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[10px] font-mono font-bold text-blue-600">
                {getPercentage(guests.accepted)}%
              </span>
            </div>
          </div>

          {/* Item 2: Declined (Rose) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 rounded-full bg-rose-500"></div>
              <span className="font-semibold text-zinc-700">Declined</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold font-mono text-zinc-900">
                {guests.declined}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-50 text-[10px] font-mono font-bold text-rose-600">
                {getPercentage(guests.declined)}%
              </span>
            </div>
          </div>

          {/* Item 3: Maybe (Amber) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 rounded-full bg-amber-400"></div>
              <span className="font-semibold text-zinc-700">Maybe</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold font-mono text-zinc-900">
                {guests.maybe}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-mono font-bold text-amber-600">
                {getPercentage(guests.maybe)}%
              </span>
            </div>
          </div>

          {/* Item 4: Pending (Neutral gray) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-3.5 rounded-full bg-zinc-300"></div>
              <span className="font-semibold text-zinc-400">Pending</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold font-mono text-zinc-400">
                {guests.pending}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-mono font-bold text-zinc-500">
                {getPercentage(guests.pending)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
