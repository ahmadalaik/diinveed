import { Banknote, Receipt, Users, Mail, ShieldCheck } from "lucide-react";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { formatIDR } from "@/features/transaction/utils/format";
import { getDashboardStats } from "@/features/admin/dashboard/lib/dashboard-stats";
import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { RevenueTrendChart } from "@/features/admin/dashboard/components/revenue-trend-chart";
import { PaymentBreakdownChart } from "@/features/admin/dashboard/components/payment-breakdown-chart";
import { RecentTransactions } from "@/features/admin/dashboard/components/recent-transactions";
import { ActionNeeded } from "@/features/admin/dashboard/components/action-needed";

export default async function AdminDashboardPage() {
  const actor = await adminIsRequired();
  const stats = await getDashboardStats(actor);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pendapatan"
          value={formatIDR(stats.revenue.total)}
          icon={<Banknote className="h-5 w-5 text-muted-foreground" />}
          delta={stats.revenue.delta}
          subtitle={<span>vs 30 hari sebelumnya</span>}
        />
        <StatCard
          label="Transaksi"
          value={String(stats.transactions.total)}
          icon={<Receipt className="h-5 w-5 text-muted-foreground" />}
          subtitle={
            <span>
              {stats.transactions.pending} pending · {stats.transactions.confirmed}{" "}
              confirmed
            </span>
          }
        />
        <StatCard
          label="Pengguna"
          value={String(stats.users.total)}
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          subtitle={<span>+{stats.users.newLast30} dalam 30 hari</span>}
        />
        <StatCard
          label="Undangan"
          value={String(stats.invitations.total)}
          icon={<Mail className="h-5 w-5 text-muted-foreground" />}
          subtitle={
            <span>
              {stats.invitations.published} publish · {stats.invitations.draft}{" "}
              draft
            </span>
          }
        />
        {stats.admins !== null && (
          <StatCard
            label="Admin"
            value={String(stats.admins)}
            icon={<ShieldCheck className="h-5 w-5 text-muted-foreground" />}
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendChart data={stats.revenueTrend} />
        </div>
        <PaymentBreakdownChart data={stats.paymentBreakdown} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentTransactions items={stats.recentTransactions} />
        <ActionNeeded actions={stats.actions} />
      </div>
    </div>
  );
}
