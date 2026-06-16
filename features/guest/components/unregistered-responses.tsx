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
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nama</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead className="text-center">Pax</TableHead>
              <TableHead>RSVP</TableHead>
              <TableHead>Harapan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {r.phoneNumber ?? "—"}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {r.guests}
                </TableCell>
                <TableCell>
                  <StatusBadge statusKey={STATUS_KEY[r.response]} />
                </TableCell>
                <TableCell className="text-muted-foreground max-w-44 truncate text-xs">
                  {r.wish ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end border-t px-4 py-2.5">
          <TablePagination page={page} totalPages={totalPages} searchParams={searchParams} pageParam="upage" />
        </div>
      )}
    </Card>
  );
}
