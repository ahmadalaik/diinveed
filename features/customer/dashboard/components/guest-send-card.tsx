import Link from "next/link";
import type { GuestSummary } from "@/features/guest/types/guest.type";
import { Progress } from "@/components/ui/progress";

interface Props {
  guests: GuestSummary;
  sentCount: number;
}

export function GuestSendCard({ guests, sentCount }: Props) {
  const total = guests.invited;
  const unsentCount = total - sentCount;

  const percent = total > 0 ? Math.round((sentCount / total) * 100) : 0;

  return (
    <div className="double-bezel-outer">
      <div className="double-bezel-inner">
        <div>
          <div className="flex items-center justify-between pb-3">
            <div>
              <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase font-semibold">
                PROGRES PENGIRIMAN TAMU
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-0.5">
                Tamu & Pengiriman
              </h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-bold text-blue-600">
                {percent}% Terkirim
              </span>
            </div>
          </div>

          {/* Sleek Cobalt Progress Bar */}
          <Progress
            value={percent}
            className="h-2.5 bg-zinc-100 border border-zinc-200/50 mt-1 *:data-[slot=progress-indicator]:bg-blue-600"
          />

          {/* Tabular layout for counters */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <p className="text-xs text-zinc-400 font-mono">TOTAL TAMU</p>
              <p className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                {total}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Terdaftar di kontak
              </p>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <p className="text-xs text-zinc-400 font-mono">TERKIRIM</p>
              <p className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                {sentCount}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Undangan terkirim
              </p>
            </div>
            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl">
              <p className="text-xs text-zinc-400 font-mono">BELUM DIKIRIM</p>
              <p className="text-2xl font-bold font-mono text-zinc-950 mt-1">
                {unsentCount < 0 ? 0 : unsentCount}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Menunggu antrean kirim
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100">
          <span className="text-xs text-zinc-400 font-mono">
            * Kelola kontak tamu atau lakukan pengiriman via WhatsApp.
          </span>
          <Link
            href="/tamu"
            className="px-5 py-2.5 text-xs font-semibold rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition active:scale-[0.98]"
          >
            {total === 0 ? "Tambah Tamu" : "Kelola Tamu & Kirim"}
          </Link>
        </div>
      </div>
    </div>
  );
}
