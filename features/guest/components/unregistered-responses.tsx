import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";
import { TablePagination } from "@/components/table-pagination";
import type { UnregisteredRsvp } from "../types/guest.type";
import type { GuestStatusKey } from "../lib/guest-status";
import { StatusBadge } from "./guest-visuals";
import type { PageSearchParams } from "@/lib/pagination";

const STATUS_KEY: Record<UnregisteredRsvp["response"], GuestStatusKey> = {
  ACCEPT: "accepted",
  DECLINE: "declined",
  MAYBE: "maybe",
};

export function UnregisteredResponses({
  responses,
  page,
  totalPages,
  searchParams,
}: {
  responses: UnregisteredRsvp[];
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
}) {
  if (responses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
          <div className="bg-muted text-muted-foreground grid size-14 place-items-center rounded-full">
            <Inbox className="size-6" />
          </div>
          <h3 className="text-base font-medium">Belum ada respon tak terdaftar</h3>
          <p className="text-muted-foreground max-w-xs text-sm">
            Balasan RSVP dari orang yang belum ada di daftar tamu akan muncul di
            sini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="text-[13.5px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-zinc-100">
            <TableHead className="font-bold text-zinc-400">Nama</TableHead>
            <TableHead className="font-bold text-zinc-400">Telepon</TableHead>
            <TableHead className="font-bold text-zinc-400 text-center">Pax</TableHead>
            <TableHead className="font-bold text-zinc-400">RSVP</TableHead>
            <TableHead className="font-bold text-zinc-400">Harapan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((r) => (
            <TableRow key={r.id} className="border-b border-zinc-100 hover:bg-zinc-50/70 transition-colors">
              <TableCell className="font-bold text-zinc-950 dark:text-white">{r.name}</TableCell>
              <TableCell className="text-zinc-500 font-medium font-mono">
                {r.phoneNumber ?? "—"}
              </TableCell>
              <TableCell className="text-center font-bold text-zinc-800 dark:text-zinc-200">
                {r.guests}
              </TableCell>
              <TableCell>
                <StatusBadge statusKey={STATUS_KEY[r.response]} />
              </TableCell>
              <TableCell className="text-zinc-500 max-w-44 truncate font-medium">
                {r.wish ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="flex justify-end border-t border-zinc-100 mt-4 pt-3.5 text-zinc-500 font-medium text-[13px]">
          <TablePagination page={page} totalPages={totalPages} searchParams={searchParams} pageParam="upage" />
        </div>
      )}
    </div>
  );
}
