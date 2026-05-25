import type {
  DiscountType,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
} from "@/generated/prisma/enums";

export type TransactionListItem = {
  id: string;
  userId: string;
  user: { name: string; email: string };
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  status: TransactionStatus;
  accessGrantedAt: Date | null;
  createdAt: Date;
  payment: {
    method: PaymentMethod;
    amount: number;
    status: PaymentStatus;
  } | null;
};

export type TransactionDetail = {
  id: string;
  userId: string;
  user: { name: string; email: string };
  originalPrice: number;
  discountType: DiscountType | null;
  discountValue: number | null;
  discountAmount: number;
  finalAmount: number;
  status: TransactionStatus;
  notes: string | null;
  accessGrantedAt: Date | null;
  createdAt: Date;
  creator: { name: string };
  payment: {
    id: string;
    method: PaymentMethod;
    amount: number;
    referenceNumber: string | null;
    senderName: string | null;
    senderBank: string | null;
    proofUrl: string | null;
    notes: string | null;
    status: PaymentStatus;
    confirmedAt: Date | null;
    confirmer: { name: string } | null;
  } | null;
};

export type UserSelectItem = {
  id: string;
  name: string;
  email: string;
};
