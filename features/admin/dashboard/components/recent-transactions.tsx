import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionStatusBadge } from "@/features/transaction/components/transaction-status-badge";
import { formatIDR } from "@/features/transaction/utils/format";
import type { RecentTransaction } from "../lib/dashboard-stats";

export function RecentTransactions({
  items,
}: {
  items: RecentTransaction[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Transaksi Terbaru</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/transactions">Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Belum ada transaksi.
          </p>
        ) : (
          <ul className="divide-y">
            {items.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{tx.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                    }).format(tx.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {formatIDR(tx.finalAmount)}
                  </span>
                  <TransactionStatusBadge status={tx.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
