"use client";

import { useEffect, useState } from "react";
import { GuestRsvpRow } from "@/features/invitation/types/invitation.type";
import { getRsvpResponses } from "../../actions/get-rsvp-responses";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

const RESPONSE_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  ACCEPT: "default",
  MAYBE: "secondary",
  DECLINE: "destructive",
};

export function RsvpResponsesPanel({ open, onOpenChange }: Props) {
  const [responses, setResponses] = useState<GuestRsvpRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const r = await getRsvpResponses();
      if (cancelled) return;
      if (r.responses) setResponses(r.responses);
      setLoading(false);
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const accept = responses.filter((r) => r.response === "ACCEPT").length;
  const maybe = responses.filter((r) => r.response === "MAYBE").length;
  const decline = responses.filter((r) => r.response === "DECLINE").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-125 sm:max-w-125 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Guest Responses</SheetTitle>
        </SheetHeader>

        <div className="flex gap-3 mt-4 mb-6">
          {[
            { label: "Total", count: responses.length, color: "" },
            { label: "Accept", count: accept, color: "text-green-600" },
            { label: "Maybe", count: maybe, color: "text-amber-500" },
            { label: "Decline", count: decline, color: "text-red-500" },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="flex-1 rounded-lg border p-3 text-center"
            >
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Loading…
          </p>
        ) : responses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No responses yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>+1</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      {r.email && (
                        <p className="text-xs text-muted-foreground">
                          {r.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={RESPONSE_VARIANT[r.response]}>
                      {r.response}
                    </Badge>
                  </TableCell>
                  <TableCell>{r.plusOne ? "Yes" : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SheetContent>
    </Sheet>
  );
}
