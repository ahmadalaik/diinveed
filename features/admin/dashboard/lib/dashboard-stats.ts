import prisma from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/enums";
import {
  buildPaymentBreakdown,
  buildRevenueTrend,
  computeDelta,
  type Delta,
  type PaymentSlice,
  type RevenuePoint,
} from "./dashboard-helpers";

const TREND_DAYS = 30;

export type RecentTransaction = {
  id: string;
  userName: string;
  finalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
};

export type DashboardStats = {
  revenue: { total: number; delta: Delta };
  transactions: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  users: { total: number; newLast30: number };
  invitations: { total: number; published: number; draft: number };
  admins: number | null;
  revenueTrend: RevenuePoint[];
  paymentBreakdown: PaymentSlice[];
  recentTransactions: RecentTransaction[];
  actions: {
    pendingPayments: number;
    pendingTransactions: number;
    draftTemplates: number;
  };
};

export async function getDashboardStats(actor: {
  role: UserRole;
}): Promise<DashboardStats> {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setUTCDate(windowStart.getUTCDate() - TREND_DAYS);
  const prevWindowStart = new Date(now);
  prevWindowStart.setUTCDate(prevWindowStart.getUTCDate() - TREND_DAYS * 2);

  const isSuperAdmin = actor.role === "super_admin";

  const [
    revenueAgg,
    revenueCurrentAgg,
    revenuePrevAgg,
    txTotal,
    txPending,
    txConfirmed,
    txCancelled,
    usersTotal,
    usersNew,
    invTotal,
    invPublished,
    adminCount,
    trendRows,
    paymentGroup,
    recentRows,
    pendingPayments,
    draftTemplates,
  ] = await Promise.all([
    prisma.transaction.aggregate({
      where: { deletedAt: null, status: "confirmed" },
      _sum: { finalAmount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        deletedAt: null,
        status: "confirmed",
        createdAt: { gte: windowStart },
      },
      _sum: { finalAmount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        deletedAt: null,
        status: "confirmed",
        createdAt: { gte: prevWindowStart, lt: windowStart },
      },
      _sum: { finalAmount: true },
    }),
    prisma.transaction.count({ where: { deletedAt: null } }),
    prisma.transaction.count({ where: { deletedAt: null, status: "pending" } }),
    prisma.transaction.count({
      where: { deletedAt: null, status: "confirmed" },
    }),
    prisma.transaction.count({
      where: { deletedAt: null, status: "cancelled" },
    }),
    prisma.user.count({ where: { deletedAt: null, role: "user" } }),
    prisma.user.count({
      where: { deletedAt: null, role: "user", createdAt: { gte: windowStart } },
    }),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { isPublished: true } }),
    isSuperAdmin
      ? prisma.user.count({
          where: { deletedAt: null, role: { in: ["admin", "super_admin"] } },
        })
      : Promise.resolve(null),
    prisma.transaction.findMany({
      where: {
        deletedAt: null,
        status: "confirmed",
        createdAt: { gte: windowStart },
      },
      select: { createdAt: true, finalAmount: true },
    }),
    prisma.payment.groupBy({
      by: ["method"],
      _count: { method: true },
    }),
    prisma.transaction.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        finalAmount: true,
        status: true,
        createdAt: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.payment.count({ where: { status: "pending" } }),
    prisma.template.count({ where: { deletedAt: null, status: "draft" } }),
  ]);

  const revenueTotal = revenueAgg._sum.finalAmount ?? 0;
  const revenueCurrent = revenueCurrentAgg._sum.finalAmount ?? 0;
  const revenuePrev = revenuePrevAgg._sum.finalAmount ?? 0;

  return {
    revenue: {
      total: revenueTotal,
      delta: computeDelta(revenueCurrent, revenuePrev),
    },
    transactions: {
      total: txTotal,
      pending: txPending,
      confirmed: txConfirmed,
      cancelled: txCancelled,
    },
    users: { total: usersTotal, newLast30: usersNew },
    invitations: {
      total: invTotal,
      published: invPublished,
      draft: invTotal - invPublished,
    },
    admins: adminCount,
    revenueTrend: buildRevenueTrend(trendRows, TREND_DAYS, now),
    paymentBreakdown: buildPaymentBreakdown(
      paymentGroup.map((g) => ({ method: g.method, count: g._count.method }))
    ),
    recentTransactions: recentRows.map((t) => ({
      id: t.id,
      userName: t.user.name,
      finalAmount: t.finalAmount,
      status: t.status,
      createdAt: t.createdAt,
    })),
    actions: {
      pendingPayments,
      pendingTransactions: txPending,
      draftTemplates,
    },
  };
}
