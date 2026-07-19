"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GuestFilters } from "../../lib/guest-where";
import type { GuestSendRow, MessageTemplate } from "../../types/guest.type";
import { WhatsAppLinkSender } from "../../lib/whatsapp";
import { buildGuestInvitationUrl } from "../../lib/guest-link";
import { getGuestsForSend } from "../../actions/get-guests-for-send";
import { markGuestSent } from "../../actions/mark-guest-sent";
import { WhatsappPreview } from "../message-template/whatsapp-preview";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: MessageTemplate[];
  invitationSlug: string;
  /** Send to explicit ids, or fall back to a filter (select-all-matching). */
  ids?: string[];
  filter?: GuestFilters;
};

export function SendInvitationDialog({
  open,
  onOpenChange,
  templates,
  invitationSlug,
  ids,
  filter,
}: Props) {
  const [recipients, setRecipients] = useState<GuestSendRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const template = templates.find((t) => t.id === templateId);

  useEffect(() => {
    if (!open) return;
    let active = true;

    const fetchGuests = async () => {
      setSent(new Set());
      setLoading(true);
      try {
        const res = await getGuestsForSend({ ids, filter });
        if (active) {
          setRecipients(res.guests ?? []);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchGuests();

    return () => {
      active = false;
    };
  }, [open, ids, filter]);

  const sendTo = (guest: GuestSendRow) => {
    if (!template) {
      toast.error("Pilih template dulu");
      return;
    }
    if (!guest.phoneNumber) {
      toast.error(`${guest.name} belum punya nomor WhatsApp`);
      return;
    }
    const link = buildGuestInvitationUrl(
      window.location.origin,
      invitationSlug,
      guest.slug,
    );
    const url = new WhatsAppLinkSender(template.body).buildSendUrl(
      { name: guest.name, phoneNumber: guest.phoneNumber, slug: guest.slug },
      link,
    );
    window.open(url, "_blank", "noopener,noreferrer");
    setSent((prev) => new Set(prev).add(guest.id));
    startTransition(async () => {
      const result = await markGuestSent(guest.id);
      if (!result.success) toast.error(result.message);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl! overflow-y-auto grid grid-cols-2">
        <DialogHeader>
          <DialogTitle>Kirim Undangan WhatsApp</DialogTitle>
          <DialogDescription>
            Pilih template, lalu kirim ke tiap tamu satu per satu lewat WhatsApp Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Template Pesan</Label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {templates.length === 0 && (
            <p className="text-muted-foreground text-xs">
              Belum ada template. Buat lewat &quot;Kelola Template&quot; dulu.
            </p>
          )}
        </div>

        {template && (
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Pratinjau</Label>
            <WhatsappPreview message={template.body} />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">
            Penerima ({recipients.length})
          </Label>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Memuat tamu…
              </p>
            ) : recipients.length === 0 ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Tidak ada tamu terpilih.
              </p>
            ) : (
              recipients.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{guest.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {guest.phoneNumber ?? "Tanpa nomor"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sent.has(guest.id) && <Badge variant="secondary">Terkirim</Badge>}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!guest.phoneNumber || !template}
                      onClick={() => sendTo(guest)}
                    >
                      <Send className="size-4" /> Kirim
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {pending && <span className="sr-only">menyimpan status…</span>}
      </DialogContent>
    </Dialog>
  );
}
