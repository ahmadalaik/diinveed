import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { TransactionDetailView } from "@/features/transaction/components/transaction-detail";
import type { TransactionDetail } from "@/features/transaction/types/transaction.type";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await adminIsRequired();
  const { id } = await params;

  const transaction = await prisma.transaction.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      userId: true,
      user: { select: { name: true, email: true } },
      originalPrice: true,
      discountType: true,
      discountValue: true,
      discountAmount: true,
      finalAmount: true,
      status: true,
      notes: true,
      accessGrantedAt: true,
      createdAt: true,
      creator: { select: { name: true } },
      payment: {
        select: {
          id: true,
          method: true,
          amount: true,
          referenceNumber: true,
          senderName: true,
          senderBank: true,
          proofUrl: true,
          notes: true,
          status: true,
          confirmedAt: true,
          confirmer: { select: { name: true } },
        },
      },
    },
  });

  if (!transaction) notFound();

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Transaksi", href: "/admin/transactions" },
          { label: transaction.user.name },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/transactions">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Detail Transaksi</h1>
      </div>
      <div className="max-w-2xl">
        <TransactionDetailView transaction={transaction as TransactionDetail} />
      </div>
    </div>
  );
}
