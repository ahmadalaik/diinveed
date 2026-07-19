import type { DashboardSummary } from "../types/dashboard.type";
import Link from "next/link";

export function RecentWishesSidebar({
  wishes,
}: {
  wishes: DashboardSummary["wishes"];
}) {
  // Format wish relative or short date
  const formatWishDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return "Hari ini";
      } else if (diffDays === 1) {
        return "Kemarin";
      } else {
        return date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      }
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div className="double-bezel-outer">
      <div className="double-bezel-inner">
        <div className="flex items-center justify-between pb-3">
          <div>
            <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase font-semibold">
              UCAPAN TERBARU
            </span>
            <h3 className="text-lg font-bold text-zinc-950 mt-0.5">
              Recent Wishes
            </h3>
          </div>
          <Link
            href="/wishes"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition font-mono"
          >
            View all →
          </Link>
        </div>

        {/* Wishes stack */}
        <div className="flex flex-col gap-3 my-3">
          {wishes.recent.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">
              Belum ada ucapan.
            </p>
          ) : (
            wishes.recent.map((wish, index) => {
              // Color variables for avatars
              const avatarColors = [
                "bg-blue-100 text-blue-600",
                "bg-zinc-200 text-zinc-700",
                "bg-amber-100 text-amber-700",
                "bg-rose-100 text-rose-700",
              ];
              const colorClass = avatarColors[index % avatarColors.length];

              return (
                <div
                  key={wish.id}
                  className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex gap-3 hover:border-zinc-300 transition"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 ${colorClass}`}
                  >
                    {wish.name ? wish.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-zinc-800 truncate">
                        {wish.name}
                      </p>
                      <span className="text-[9px] font-mono text-zinc-400 shrink-0">
                        {formatWishDate(wish.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      &ldquo;{wish.wish}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active wish count helper */}
        {wishes.pendingCount > 0 && (
          <div className="bg-blue-50 text-blue-700 border border-blue-100 rounded-xl p-2.5 mt-2 flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-mono font-semibold">
              {wishes.pendingCount} Ucapan menunggu moderasi
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
