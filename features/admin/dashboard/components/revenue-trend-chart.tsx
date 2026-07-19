"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatIDR } from "@/features/transaction/utils/format";
import type { RevenuePoint } from "../lib/dashboard-helpers";

const chartConfig = {
  revenue: { label: "Pendapatan", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function RevenueTrendChart({ data }: { data: RevenuePoint[] }) {
  const total = data.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tren Pendapatan (30 hari)</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Belum ada pendapatan dalam 30 hari terakhir.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => value.slice(5)}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatIDR(Number(value))}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.2}
                stroke="var(--color-revenue)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
