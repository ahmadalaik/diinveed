import Link from "next/link";
import { CheckCircle2, CreditCard, Clock, FileEdit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Actions = {
  pendingPayments: number;
  pendingTransactions: number;
  draftTemplates: number;
};

export function ActionNeeded({ actions }: { actions: Actions }) {
  const items = [
    {
      key: "payments",
      label: "Pembayaran menunggu konfirmasi",
      count: actions.pendingPayments,
      href: "/admin/transactions",
      icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    },
    {
      key: "transactions",
      label: "Transaksi pending",
      count: actions.pendingTransactions,
      href: "/admin/transactions",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      key: "templates",
      label: "Template draft",
      count: actions.draftTemplates,
      href: "/admin/templates",
      icon: <FileEdit className="h-4 w-4 text-muted-foreground" />,
    },
  ].filter((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Perlu Tindakan</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            Tidak ada yang perlu ditindaklanjuti.
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-2 py-2.5 transition-colors hover:bg-muted"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {item.icon}
                    {item.label}
                  </span>
                  <Badge variant="secondary">{item.count}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
