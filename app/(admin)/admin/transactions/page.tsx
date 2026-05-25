import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/features/transaction/components/transaction-table";
import type { TransactionListItem } from "@/features/transaction/types/transaction.type";

export default async function AdminTransactionPage() {
  await adminIsRequired();

  const transactions = await prisma.transaction.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      userId: true,
      user: { select: { name: true, email: true } },
      originalPrice: true,
      discountAmount: true,
      finalAmount: true,
      status: true,
      accessGrantedAt: true,
      createdAt: true,
      payment: {
        select: {
          method: true,
          amount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transaksi</h1>
        <Button asChild>
          <Link href="/admin/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Link>
        </Button>
      </div>
      <TransactionTable transactions={transactions as TransactionListItem[]} />
    </div>
  );
}
