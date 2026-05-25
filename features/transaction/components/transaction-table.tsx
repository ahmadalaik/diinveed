"use client";

import { Eye, Link, Table } from "lucide-react";
import { TransactionListItem } from "../types/transaction.type";
import {
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

interface TransactionTableProps {
  transactions: TransactionListItem[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Belum ada transaksi
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5">
            <TableHead className="px-4 py-3">User</TableHead>
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
            <TableRow key={tx.id}>
              <TableCell className="px-4 py-3">
                <div>
                  <p className="font-medium">{tx.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.user.email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                {formatIDR(tx.originalPrice)}
              </TableCell>
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
                {tx.payment ? (
                  <PaymentMethodBadge method={tx.payment.method} />
                ) : (
                  "-"
                )}
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
    </div>
  );
}
