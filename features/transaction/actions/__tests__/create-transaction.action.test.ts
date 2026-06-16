import { getCurrentUser } from "@/features/auth/utils/session";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransactionAction } from "../create-transaction.action";
import { ACTION_MESSAGES } from "@/lib/action-response";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: vi.fn(),
  },
}));

vi.mock("@/features/auth/utils/session", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

const prismaMock = prisma as unknown as {
  $transaction: ReturnType<typeof vi.fn>;
};
const getCurrentUserMock = getCurrentUser as ReturnType<typeof vi.fn>;

const validInput = {
  userId: "user-1",
  originalPrice: 500000,
  discountType: null as null,
  discountValue: null as null,
  notes: "",
  paymentMethod: "bank_transfer" as const,
  paymentAmount: 500000,
  referenceNumber: "REF123",
  senderName: "Budi",
  senderBank: "BCA",
  proofUrl: "",
  paymentNotes: "",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createTransactionAction", () => {
  it("returns Unauthorized when not logged in", async () => {
    getCurrentUserMock.mockResolvedValue(null);
    const result = await createTransactionAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("returns Unauthorized when actor is a regular user", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "user" });
    const result = await createTransactionAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.UNAUTHORIZED);
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const result = await createTransactionAction({
      ...validInput,
      originalPrice: 0,
    });
    expect(result.errors?.originalPrice).toBeDefined();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("returns validation error when discountType set but discountValue missing", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const result = await createTransactionAction({
      ...validInput,
      discountType: "percentage",
      discountValue: null,
    });
    expect(result.errors?.discountValue).toBeDefined();
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("creates transaction and payment atomically for valid input without discount", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const txMock = {
      transaction: { create: vi.fn().mockResolvedValue({ id: "tx-1" }) },
      payment: { create: vi.fn().mockResolvedValue({ id: "pay-1" }) },
    };
    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock),
    );

    const result = await createTransactionAction(validInput);

    expect(result.success).toBe(true);
    expect(result.data?.transactionId).toBe("tx-1");
    expect(txMock.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "user-1",
          originalPrice: 500000,
          discountAmount: 0,
          finalAmount: 500000,
          status: "confirmed",
        }),
      }),
    );
    expect(txMock.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          transactionId: "tx-1",
          method: "bank_transfer",
          amount: 500000,
          status: "confirmed",
          confirmedBy: "actor-1",
        }),
      }),
    );
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "transaction.created",
        targetType: "transaction",
        targetId: "tx-1",
      }),
    );
  });

  it("correctly computes percentage discount", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const txMock = {
      transaction: { create: vi.fn().mockResolvedValue({ id: "tx-2" }) },
      payment: { create: vi.fn().mockResolvedValue({ id: "pay-2" }) },
    };
    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock),
    );

    await createTransactionAction({
      ...validInput,
      discountType: "percentage",
      discountValue: 20,
      paymentAmount: 400000,
    });

    expect(txMock.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          discountAmount: 100000,
          finalAmount: 400000,
        }),
      }),
    );
  });

  it("correctly computes fixed discount", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    const txMock = {
      transaction: { create: vi.fn().mockResolvedValue({ id: "tx-3" }) },
      payment: { create: vi.fn().mockResolvedValue({ id: "pay-3" }) },
    };
    prismaMock.$transaction.mockImplementation(
      async (fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock),
    );

    await createTransactionAction({
      ...validInput,
      discountType: "fixed",
      discountValue: 50000,
      paymentAmount: 450000,
    });

    expect(txMock.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          discountAmount: 50000,
          finalAmount: 450000,
        }),
      }),
    );
  });

  it("returns form error when database fails", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "actor-1", role: "admin" });
    prismaMock.$transaction.mockRejectedValue(new Error("DB error"));
    const result = await createTransactionAction(validInput);
    expect(result.success).toBe(false);
    expect(result.message).toBe(ACTION_MESSAGES.SERVER_ERROR);
  });
});
