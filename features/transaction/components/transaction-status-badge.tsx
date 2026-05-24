"use client";

import { Badge } from "@/components/ui/badge";
import type {
  PaymentMethod,
  TransactionStatus,
} from "@/generated/prisma/enums";
import {
  PAYMENT_METHOD_LABELS,
  TRANSACTION_STATUS_LABELS,
} from "../utils/format";

const statusVariants: Record<
  TransactionStatus,
  "default" | "secondary" | "destructive"
> = {
  confirmed: "default",
  pending: "secondary",
  cancelled: "destructive",
};

export function TransactionStatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  return (
    <Badge variant={statusVariants[status]}>
      {TRANSACTION_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return (
    <Badge variant="outline">{PAYMENT_METHOD_LABELS[method] ?? method}</Badge>
  );
}
