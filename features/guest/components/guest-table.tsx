"use client";

import { useState } from "react";
import { Plus, Send, Users, X } from "lucide-react";
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
  toolbar: React.ReactNode;
};

export function GuestTable({
  guests,
  categories,
  templates,
  invitationSlug,
  filters,
  searchParams,
  toolbar,
}: Props) {
  const { rows: guestRows, page, totalPages, total } = guests;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allMatching, setAllMatching] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [sendIds, setSendIds] = useState<string[] | undefined>(undefined);

  const pageIds = guestRows.map((g) => g.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
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
      {toolbar}

      {/* Bulk action bar */}
      {selectionCount > 0 && (
        <div className="bg-primary text-primary-foreground flex flex-wrap items-center gap-2.5 rounded-md px-3.5 py-2 text-sm">
          <span className="font-mono">{selectionCount}</span>
          <span className="opacity-80">terpilih</span>
          {allOnPageSelected && !allMatching && total > guestRows.length && (
            <button className="underline opacity-90" onClick={() => setAllMatching(true)}>
              Pilih semua {total} tamu yang cocok
            </button>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
              onClick={openBulkSend}
            >
              <Send className="size-3.5" /> Kirim WhatsApp ({selectionCount})
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20 hover:text-white"
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
        <Card className="overflow-hidden py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-9">
                    <Checkbox
                      checked={allOnPageSelected}
                      onCheckedChange={togglePage}
                      aria-label="Pilih semua di halaman"
                    />
                  </TableHead>
                  <TableHead>Tamu</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Pax</TableHead>
                  <TableHead>RSVP</TableHead>
                  <TableHead>Undangan</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {guestRows.map((guest) => {
                  const st = guestStatus(guest);
                  const checked = allMatching || selected.has(guest.id);
                  return (
                    <TableRow key={guest.id} className="group">
                      <TableCell>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggle(guest.id)}
                          aria-label={`Pilih ${guest.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px]">
                              {initials(guest.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{guest.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {guest.phoneNumber ?? "—"}
                      </TableCell>
                      <TableCell>
                        {guest.category ? (
                          <Badge variant="outline" className="font-normal">
                            {guest.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">{guest.invitedCount}</TableCell>
                      <TableCell>
                        <StatusBadge statusKey={st.key} label={st.label} />
                      </TableCell>
                      <TableCell>
                        <SendIndicator sentAt={guest.sentAt} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            aria-label={`Kirim ke ${guest.name}`}
                            onClick={() => openRowSend(guest.id)}
                          >
                            <Send className="size-3.5" />
                          </Button>
                          <GuestFormDialog
                            mode="edit"
                            guest={guest}
                            categories={categories}
                            trigger={
                              <Button size="icon" variant="ghost" className="size-7">
                                <span className="sr-only">Edit</span>
                                <Plus className="size-3.5 rotate-45" />
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
                                className="text-muted-foreground hover:text-destructive size-7"
                              >
                                <X className="size-3.5" />
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
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5">
            <span className="text-muted-foreground text-xs">
              Menampilkan <span className="text-foreground font-mono">{guestRows.length}</span> dari{" "}
              <span className="font-mono">{total}</span> tamu
            </span>
            <TablePagination page={page} totalPages={totalPages} searchParams={searchParams} />
          </div>
        </Card>
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
          Tambahkan tamu pertama Anda untuk mulai mengelola daftar undangan dan memantau RSVP.
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
