"use client";

import type { TransactionDetail } from "../types/transaction.type";
import { formatIDR } from "../utils/format";
import { TransactionStatusBadge, PaymentMethodBadge } from "./transaction-status-badge";
import { Badge } from "@/components/ui/badge";

interface TransactionDetailProps {
  transaction: TransactionDetail;
}

export function TransactionDetailView({
  transaction: tx,
}: TransactionDetailProps) {
  return (
    <div className="space-y-6">
      {/* Transaction info */}
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="text-base font-semibold">Detail Transaksi</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">User</dt>
            <dd className="font-medium">{tx.user.name}</dd>
            <dd className="text-muted-foreground text-xs">{tx.user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-1">
              <TransactionStatusBadge status={tx.status} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Harga Asli</dt>
            <dd className="font-medium">{formatIDR(tx.originalPrice)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Diskon</dt>
            <dd className="font-medium">
              {tx.discountAmount > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  -{formatIDR(tx.discountAmount)}
                  {tx.discountType === "percentage" && tx.discountValue
                    ? ` (${tx.discountValue}%)`
                    : ""}
                </span>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-lg font-semibold">
              {formatIDR(tx.finalAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Akses Diberikan</dt>
            <dd>
              {tx.accessGrantedAt ? (
                <Badge variant="default" className="text-xs">
                  {tx.accessGrantedAt.toLocaleDateString("id-ID")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Belum aktif
                </Badge>
              )}
            </dd>
          </div>
          {tx.notes && (
            <div className="col-span-2">
              <dt className="text-muted-foreground">Catatan</dt>
              <dd>{tx.notes}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted-foreground">Dibuat oleh</dt>
            <dd>{tx.creator.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tanggal</dt>
            <dd>{tx.createdAt.toLocaleDateString("id-ID")}</dd>
          </div>
        </dl>
      </div>

      {/* Payment info */}
      {tx.payment && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-base font-semibold">Detail Pembayaran</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Metode</dt>
              <dd className="mt-1">
                <PaymentMethodBadge method={tx.payment.method} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Nominal Dibayar</dt>
              <dd className="font-medium">{formatIDR(tx.payment.amount)}</dd>
            </div>
            {tx.payment.referenceNumber && (
              <div>
                <dt className="text-muted-foreground">No. Referensi</dt>
                <dd className="font-mono">{tx.payment.referenceNumber}</dd>
              </div>
            )}
            {tx.payment.senderName && (
              <div>
                <dt className="text-muted-foreground">Nama Pengirim</dt>
                <dd>{tx.payment.senderName}</dd>
              </div>
            )}
            {tx.payment.senderBank && (
              <div>
                <dt className="text-muted-foreground">Bank Pengirim</dt>
                <dd>{tx.payment.senderBank}</dd>
              </div>
            )}
            {tx.payment.confirmer && (
              <div>
                <dt className="text-muted-foreground">Dikonfirmasi oleh</dt>
                <dd>{tx.payment.confirmer.name}</dd>
              </div>
            )}
            {tx.payment.confirmedAt && (
              <div>
                <dt className="text-muted-foreground">Waktu Konfirmasi</dt>
                <dd>{tx.payment.confirmedAt.toLocaleDateString("id-ID")}</dd>
              </div>
            )}
            {tx.payment.notes && (
              <div className="col-span-2">
                <dt className="text-muted-foreground">Catatan Pembayaran</dt>
                <dd>{tx.payment.notes}</dd>
              </div>
            )}
            {tx.payment.proofUrl && (
              <div className="col-span-2">
                <dt className="text-muted-foreground mb-1">Bukti Pembayaran</dt>
                <dd>
                  <a
                    href={tx.payment.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline"
                  >
                    Lihat bukti
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
