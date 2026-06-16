import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { adminIsRequired } from "@/features/auth/utils/middleware";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/layout/breadcrumb";
import { CreateTransactionForm } from "@/features/transaction/components/form/create-transaction-form";
import type { UserSelectItem } from "@/features/transaction/types/transaction.type";

export default async function NewTransactionPage() {
  await adminIsRequired();

  const users = await prisma.user.findMany({
    where: { deletedAt: null, role: "user", status: "active" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        segments={[
          { label: "Transaksi", href: "/admin/transactions" },
          { label: "Tambah Transaksi" },
        ]}
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/transactions">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Tambah Transaksi</h1>
      </div>
      <div className="max-w-lg">
        <CreateTransactionForm users={users as UserSelectItem[]} />
      </div>
    </div>
  );
}