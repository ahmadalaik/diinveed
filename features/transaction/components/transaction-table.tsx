"use client";

import Link from "next/link";
import { Eye, Receipt } from "lucide-react";
import { TransactionListItem } from "../types/transaction.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIDR } from "../utils/format";
import {
  PaymentMethodBadge,
  TransactionStatusBadge,
} from "./transaction-status-badge";
import { Button } from "@/components/ui/button";
import { DataTableCard } from "@/components/data-table-card";
import { TableEmptyState } from "@/components/table-empty-state";
import type { PageSearchParams } from "@/lib/pagination";

interface TransactionTableProps {
  transactions: TransactionListItem[];
  total: number;
  perPage: number;
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
}

export function TransactionTable({
  transactions,
  total,
  perPage,
  page,
  totalPages,
  searchParams,
}: TransactionTableProps) {
  if (total === 0) {
    return (
      <TableEmptyState
        icon={Receipt}
        title="Belum ada transaksi"
        description="Transaksi akan muncul di sini setelah pengguna melakukan pembelian."
      />
    );
  }

  return (
    <DataTableCard
      total={total}
      shownCount={transactions.length}
      noun="transaksi"
      perPage={perPage}
      page={page}
      totalPages={totalPages}
      searchParams={searchParams}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4 py-3">Pengguna</TableHead>
            <TableHead className="px-4 py-3">Harga Asli</TableHead>
            <TableHead className="px-4 py-3">Diskon</TableHead>
            <TableHead className="px-4 py-3">Total</TableHead>
            <TableHead className="px-4 py-3">Metode</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Tanggal</TableHead>
            <TableHead className="px-4 py-3 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="group">
              <TableCell className="px-4 py-3">
                <div>
                  <p className="font-medium">{tx.user.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.user.email}</p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">{formatIDR(tx.originalPrice)}</TableCell>
              <TableCell className="px-4 py-3">
                {tx.discountAmount > 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    -{formatIDR(tx.discountAmount)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 font-medium">
                {formatIDR(tx.finalAmount)}
              </TableCell>
              <TableCell className="px-4 py-3">
                {tx.payment ? <PaymentMethodBadge method={tx.payment.method} /> : "-"}
              </TableCell>
              <TableCell className="px-4 py-3">
                <TransactionStatusBadge status={tx.status} />
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                {tx.createdAt.toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/transactions/${tx.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Lihat</span>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableCard>
  );
}
