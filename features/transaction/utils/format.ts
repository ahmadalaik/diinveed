export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: "Tansfer Bank",
  qris: "QRIS",
  e_wallet: "E-Wallet",
  cash: "Cash",
  gateway: "Payment Gateway",
};

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};
