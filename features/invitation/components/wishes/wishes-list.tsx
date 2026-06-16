"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Eye, EyeOff, MessageSquareHeart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { moderateWish } from "@/features/invitation/actions/moderate-wish";
import { deleteWish } from "@/features/invitation/actions/delete-wish";
import type { WishRow, WishModerationStatus } from "@/features/invitation/types/invitation.type";
import { TablePagination } from "@/components/table-pagination";
import { TableEmptyState } from "@/components/table-empty-state";
import type { PageSearchParams } from "@/lib/pagination";

type Counts = { all: number; pending: number; approved: number; hidden: number };

const TABS: { label: string; status?: WishModerationStatus; countKey: keyof Counts }[] = [
  { label: "Semua", countKey: "all" },
  { label: "Menunggu", status: "PENDING", countKey: "pending" },
  { label: "Tampil", status: "APPROVED", countKey: "approved" },
  { label: "Disembunyikan", status: "HIDDEN", countKey: "hidden" },
];

const STATUS_BADGE: Record<WishModerationStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  PENDING: { label: "Menunggu", variant: "secondary" },
  APPROVED: { label: "Tampil", variant: "default" },
  HIDDEN: { label: "Disembunyikan", variant: "destructive" },
};

export function WishesList({
  rows,
  counts,
  activeStatus,
  page,
  totalPages,
}: {
  rows: WishRow[];
  counts: Counts;
  activeStatus?: WishModerationStatus;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const runModerate = (id: string, action: "approve" | "hide" | "show") => {
    startTransition(async () => {
      const result = await moderateWish({ id, action });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const id = pendingDelete;
    setPendingDelete(null);
    startTransition(async () => {
      const result = await deleteWish(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  const hrefFor = (status?: WishModerationStatus) =>
    status ? `/rsvp?status=${status}` : "/rsvp";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.status === activeStatus;
          return (
            <Button
              key={t.label}
              asChild
              size="sm"
              variant={active ? "default" : "outline"}
            >
              <Link href={hrefFor(t.status)}>
                {t.label} ({counts[t.countKey]})
              </Link>
            </Button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <TableEmptyState
          icon={MessageSquareHeart}
          title="Belum ada ucapan"
          description="Ucapan dari tamu akan muncul di sini begitu mereka mengisi RSVP."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengirim</TableHead>
              <TableHead>Ucapan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const badge = STATUS_BADGE[r.moderationStatus];
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="text-sm font-medium">{r.name}</p>
                    {r.category && (
                      <p className="text-xs text-muted-foreground">{r.category}</p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm whitespace-pre-line">{r.wish}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {r.moderationStatus === "PENDING" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Setujui"
                        disabled={isPending}
                        onClick={() => runModerate(r.id, "approve")}
                      >
                        <Check className="size-4" />
                      </Button>
                    )}
                    {r.moderationStatus === "HIDDEN" ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Tampilkan"
                        disabled={isPending}
                        onClick={() => runModerate(r.id, "show")}
                      >
                        <Eye className="size-4" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Sembunyikan"
                        disabled={isPending}
                        onClick={() => runModerate(r.id, "hide")}
                      >
                        <EyeOff className="size-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Hapus"
                      disabled={isPending}
                      onClick={() => setPendingDelete(r.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          searchParams={
            (activeStatus ? { status: activeStatus } : {}) as PageSearchParams
          }
        />
      )}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus ucapan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Menghapus ucapan juga menghapus konfirmasi kehadiran tamu ini dari
              data RSVP. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
