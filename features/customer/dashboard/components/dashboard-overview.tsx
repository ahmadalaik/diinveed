import type { DashboardSummary } from "../types/dashboard.type";
import { MyInvitationCard } from "./my-invitation-card";
import { RsvpBreakdownCard } from "./rsvp-breakdown-card";
import { RecentWishesSidebar } from "./recent-wishes-sidebar";
import { GuestSendCard } from "./guest-send-card";

interface Props {
  user: string;
  summary: DashboardSummary;
}

export function DashboardOverview({ user, summary }: Props) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 text-zinc-900 pb-10 font-outfit">
      {/* Top Workspace Eyebrow & Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
              Halo {user}!
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Pantau kesiapan undangan, RSVP, pengiriman tamu, dan ucapan
              terbaru dalam satu workspace terintegrasi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2 (Main Workspace) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <MyInvitationCard summary={summary} />
          <GuestSendCard
            guests={summary.guests}
            sentCount={summary.sentCount}
          />
        </div>

        {/* Column 3 (Sidebar widgets) */}
        <div className="flex flex-col gap-6">
          <RsvpBreakdownCard guests={summary.guests} />
          <RecentWishesSidebar wishes={summary.wishes} />
        </div>
      </div>
    </div>
  );
}
