import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GuestSummary } from "../types/guest.type";
import { Donut, GROUP_META } from "./guest-visuals";

export function GuestSummaryCard({ summary }: { summary: GuestSummary }) {
  const donutData = [
    { label: "Hadir", value: summary.accepted, color: GROUP_META.hadir.chart },
    { label: "Mungkin", value: summary.maybe, color: GROUP_META.mungkin.chart },
    { label: "Tidak hadir", value: summary.declined, color: GROUP_META["tidak-hadir"].chart },
    { label: "Menunggu", value: summary.pending, color: GROUP_META.menunggu.chart },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-sm">Rincian respons</CardTitle>
            <CardDescription>{summary.invited} tamu telah diundang</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
            <div className="grid place-items-center">
              <Donut data={donutData} />
            </div>
            <div className="flex flex-col gap-2.5">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground flex-1 truncate text-sm">{d.label}</span>
                  <span className="font-mono text-sm font-medium">{d.value}</span>
                </div>
              ))}
              <Separator className="my-1" />
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">Total tamu hadir</span>
                <span className="font-mono text-sm font-medium">
                  {summary.attendingHeadcount}
                  <span className="text-muted-foreground ml-1 text-xs font-normal">pax</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Diundang" value={summary.invited} />
        <StatTile label="Hadir" value={summary.accepted} foot={`${summary.attendingHeadcount} pax`} />
        <StatTile label="Belum jawab" value={summary.pending} />
        <StatTile label="Tak terdaftar" value={summary.unregistered} />
      </div>
    </div>
  );
}

function StatTile({ label, value, foot }: { label: string; value: number; foot?: string }) {
  return (
    <Card className="gap-0 py-4">
      <CardContent className="px-4">
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1.5 font-mono text-2xl font-medium tracking-tight">{value}</div>
        {foot && <div className="text-muted-foreground mt-1 text-xs">{foot}</div>}
      </CardContent>
    </Card>
  );
}
