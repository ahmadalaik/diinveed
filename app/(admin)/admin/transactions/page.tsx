import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/features/transaction/components/transaction-table";
import type { TransactionListItem } from "@/features/transaction/types/transaction.type";
import { PageHeader } from "@/components/page-header";
import { getPagination, getTotalPages, type PageSearchParams } from "@/lib/pagination";

export default async function AdminTransactionPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  await adminIsRequired();
  const sp = await searchParams;
  const { page, perPage, skip, take } = getPagination(sp);

  const where = { deletedAt: null };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
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
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = getTotalPages(total, perPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaksi"
        actions={
          <Button asChild>
            <Link href="/admin/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Link>
          </Button>
        }
      />
      <TransactionTable
        transactions={transactions as TransactionListItem[]}
        total={total}
        perPage={perPage}
        page={page}
        totalPages={totalPages}
        searchParams={sp}
      />
    </div>
  );
}
