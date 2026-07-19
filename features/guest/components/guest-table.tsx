"use client";

import { useState } from "react";
import { Edit3, Plus, Send, Trash2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/table-pagination";
import type { PageSearchParams } from "@/lib/pagination";
import type { GuestWithRsvp, MessageTemplate } from "../types/guest.type";
import type { GuestFilters } from "../lib/guest-where";
import { guestStatus } from "../lib/guest-status";
import { SendIndicator, StatusBadge, initials } from "./guest-visuals";
import { GuestFormDialog } from "./guest-form-dialog";
import { DeleteGuestDialog } from "./delete-guest-dialog";
import { SendInvitationDialog } from "./send/send-invitation-dialog";
import { cn } from "@/lib/utils";

export type GuestList = {
  rows: GuestWithRsvp[];
  page: number;
  totalPages: number;
  total: number;
};

type Props = {
  guests: GuestList;
  categories: string[];
  templates: MessageTemplate[];
  invitationSlug: string;
  filters: GuestFilters;
  searchParams: PageSearchParams;
};

export function GuestTable({
  guests,
  categories,
  templates,
  invitationSlug,
  filters,
  searchParams,
}: Props) {
  const { rows: guestRows, page, totalPages, total } = guests;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allMatching, setAllMatching] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendIds, setSendIds] = useState<string[] | undefined>(undefined);

  const pageIds = guestRows.map((g) => g.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const selectionCount = allMatching ? total : selected.size;

  const toggle = (id: string) => {
    setAllMatching(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setAllMatching(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setAllMatching(false);
  };

  const openBulkSend = () => {
    setSendIds(allMatching ? undefined : [...selected]);
    setSendOpen(true);
  };

  const openRowSend = (id: string) => {
    setSendIds([id]);
    setSendOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {selectionCount > 0 && (
        <div className="bg-zinc-900 text-zinc-100 flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-2 text-[13px] font-medium shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">{selectionCount}</span>
            <span className="opacity-80">tamu dipilih dari halaman ini</span>
            {allOnPageSelected && !allMatching && total > guestRows.length && (
              <button
                className="underline opacity-90 font-bold ml-1"
                onClick={() => setAllMatching(true)}
              >
                Pilih semua {total} tamu yang cocok
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-full px-3 h-7 text-[11.5px] font-bold"
              onClick={openBulkSend}
            >
              <Send /> Kirim WhatsApp ({selectionCount})
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white size-7 rounded-full flex items-center justify-center"
              onClick={clearSelection}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {total === 0 ? (
        <EmptyState categories={categories} />
      ) : (
        <div className="overflow-x-auto">
          <Table className="text-[13.5px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-zinc-100">
                <TableHead className="w-9">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={togglePage}
                    aria-label="Pilih semua di halaman"
                    className="border-zinc-300"
                  />
                </TableHead>
                <TableHead className="font-bold text-zinc-500">Tamu</TableHead>
                <TableHead className="font-bold text-zinc-500">
                  Telepon
                </TableHead>
                <TableHead className="font-bold text-zinc-500">
                  Kategori
                </TableHead>
                <TableHead className="font-bold text-zinc-500 text-center">
                  Pax
                </TableHead>
                <TableHead className="font-bold text-zinc-500">RSVP</TableHead>
                <TableHead className="font-bold text-zinc-500">
                  Undangan
                </TableHead>
                <TableHead className="w-10 text-right font-bold text-zinc-500">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guestRows.map((guest, idx) => {
                const st = guestStatus(guest);
                const checked = allMatching || selected.has(guest.id);

                // Cycle avatar colors: blue, rose, amber, default zinc
                const colorCycles = ["blue", "rose", "amber", "zinc"];
                const colorTheme = colorCycles[idx % colorCycles.length];
                const avatarBg =
                  colorTheme === "blue"
                    ? "bg-blue-50 text-blue-800"
                    : colorTheme === "rose"
                      ? "bg-rose-50 text-rose-800"
                      : colorTheme === "amber"
                        ? "bg-amber-50 text-amber-800"
                        : "bg-zinc-100 text-zinc-650 bg-zinc-100/80 text-zinc-600";

                return (
                  <TableRow
                    key={guest.id}
                    className="group border-b border-zinc-100 hover:bg-zinc-50/70 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(guest.id)}
                        aria-label={`Pilih ${guest.name}`}
                        className="border-zinc-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5 font-bold text-zinc-950 dark:text-white">
                        <Avatar>
                          <AvatarFallback
                            className={cn(
                              "text-[11px] font-extrabold",
                              avatarBg,
                            )}
                          >
                            {initials(guest.name)}
                          </AvatarFallback>
                        </Avatar>
                        {guest.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 font-medium">
                      {guest.phoneNumber ?? "—"}
                    </TableCell>
                    <TableCell>
                      {guest.category ? (
                        <Badge
                          variant="secondary"
                          className="h-auto bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700 px-2.5 py-0.5 text-[11.5px] font-semibold rounded-full"
                        >
                          {guest.category}
                        </Badge>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-bold text-zinc-800 dark:text-zinc-200">
                      {guest.invitedCount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge statusKey={st.key} label={st.label} />
                    </TableCell>
                    <TableCell>
                      <SendIndicator sentAt={guest.sentAt} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1 items-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                          aria-label={`Kirim ke ${guest.name}`}
                          onClick={() => openRowSend(guest.id)}
                          title="Kirim Pesan"
                        >
                          <Send />
                        </Button>
                        <GuestFormDialog
                          mode="edit"
                          guest={guest}
                          categories={categories}
                          trigger={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                              title="Edit Tamu"
                            >
                              <span className="sr-only">Edit</span>
                              <Edit3 />
                            </Button>
                          }
                        />
                        <DeleteGuestDialog
                          guestId={guest.id}
                          guestName={guest.name}
                          trigger={
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 rounded-full text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Hapus Tamu"
                            >
                              <Trash2 />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Footer pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 mt-4 pt-3.5 text-zinc-500 font-medium text-[13px]">
            <span>
              Menampilkan{" "}
              <span className="text-zinc-800 font-bold">
                {guestRows.length}
              </span>{" "}
              dari <span className="text-zinc-800 font-bold">{total}</span> tamu
            </span>
            <TablePagination
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
            />
          </div>
        </div>
      )}

      <SendInvitationDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        templates={templates}
        invitationSlug={invitationSlug}
        ids={sendIds}
        filter={sendIds ? undefined : filters}
      />
    </div>
  );
}

function EmptyState({ categories }: { categories: string[] }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
        <div className="bg-muted text-muted-foreground grid size-14 place-items-center rounded-full">
          <Users className="size-6" />
        </div>
        <h3 className="text-base font-medium">Belum ada tamu</h3>
        <p className="text-muted-foreground max-w-xs text-sm">
          Tambahkan tamu pertama Anda untuk mulai mengelola daftar undangan dan
          memantau RSVP.
        </p>
        <GuestFormDialog
          mode="create"
          categories={categories}
          trigger={
            <Button size="sm" className="mt-2">
              <Plus className="size-4" /> Tambah tamu
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
