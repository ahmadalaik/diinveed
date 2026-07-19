import type { DashboardSummary } from "../types/dashboard.type";
import { Send, Users, MessageSquareHeart } from "lucide-react";

export function RsvpStatsCards({ summary }: { summary: DashboardSummary }) {
  const { sentCount, guests, wishes } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Sent Card */}
      <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600 mb-1">Total Sent</p>
          <p className="text-3xl font-bold text-emerald-950">{sentCount}</p>
        </div>
        <div className="bg-emerald-200/50 p-3 rounded-xl text-emerald-700">
          <Send className="w-6 h-6" />
        </div>
      </div>

      {/* Attending Card */}
      <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-rose-600 mb-1">Attending (Headcount)</p>
          <p className="text-3xl font-bold text-rose-950">{guests.attendingHeadcount}</p>
        </div>
        <div className="bg-rose-200/50 p-3 rounded-xl text-rose-700">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Wishes Card */}
      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">Total Wishes</p>
          <p className="text-3xl font-bold text-blue-950">{wishes.recent.length + wishes.pendingCount}</p>
        </div>
        <div className="bg-blue-200/50 p-3 rounded-xl text-blue-700">
          <MessageSquareHeart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
