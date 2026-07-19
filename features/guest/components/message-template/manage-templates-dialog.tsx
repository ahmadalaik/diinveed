"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Bold, Italic, Plus, Strikethrough, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MESSAGE_PRESETS } from "../../configs/message-presets";
import { wrapSelection } from "../../lib/wa-format";
import type { MessageTemplate } from "../../types/guest.type";
import { createTemplate } from "../../actions/create-template";
import { updateTemplate } from "../../actions/update-template";
import { deleteTemplate } from "../../actions/delete-template";
import { WhatsappPreview } from "./whatsapp-preview";

type Props = {
  templates: MessageTemplate[];
  trigger: React.ReactNode;
};

type Draft = { id: string | null; title: string; body: string };

const EMPTY: Draft = { id: null, title: "", body: "" };

export function ManageTemplatesDialog({ templates, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLTextAreaElement>(null);

  const editExisting = (t: MessageTemplate) =>
    setDraft({ id: t.id, title: t.title, body: t.body });

  const applyMarker = (marker: string) => {
    const el = ref.current;
    if (!el) return;
    const next = wrapSelection(draft.body, el.selectionStart, el.selectionEnd, marker);
    setDraft((d) => ({ ...d, body: next.value }));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  };

  const save = () =>
    startTransition(async () => {
      const result = draft.id
        ? await updateTemplate({ id: draft.id, title: draft.title, body: draft.body })
        : await createTemplate({ title: draft.title, body: draft.body });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setDraft(EMPTY);
    });

  const remove = (id: string) =>
    startTransition(async () => {
      const result = await deleteTemplate(id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (draft.id === id) setDraft(EMPTY);
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Template Pesan</DialogTitle>
          <DialogDescription>
            Gunakan {"{nama}"} untuk nama tamu dan {"{link}"} untuk link undangan.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          {/* Existing templates */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Template</Label>
              <Button variant="ghost" size="sm" onClick={() => setDraft(EMPTY)}>
                <Plus className="size-3.5" /> Baru
              </Button>
            </div>
            <div className="space-y-1">
              {templates.length === 0 && (
                <p className="text-muted-foreground text-xs">Belum ada template.</p>
              )}
              {templates.map((t) => (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-center gap-1 rounded-md border px-2 py-1.5 text-left",
                    draft.id === t.id ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-muted",
                  )}
                >
                  <button className="min-w-0 flex-1 truncate text-sm" onClick={() => editExisting(t)}>
                    {t.title}
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive size-6"
                    disabled={pending}
                    onClick={() => remove(t.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="tpl-title">Judul</Label>
              <Input
                id="tpl-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="mis. Undangan resmi"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Salin dari preset</Label>
              <Select
                onValueChange={(id) => {
                  const preset = MESSAGE_PRESETS.find((p) => p.id === id);
                  if (preset) setDraft((d) => ({ ...d, body: preset.body }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih preset (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  {MESSAGE_PRESETS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1">
              <Button type="button" variant="outline" size="icon" onClick={() => applyMarker("*")} aria-label="Tebal">
                <Bold className="size-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => applyMarker("_")} aria-label="Miring">
                <Italic className="size-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => applyMarker("~")} aria-label="Coret">
                <Strikethrough className="size-4" />
              </Button>
            </div>

            <Textarea
              ref={ref}
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              rows={8}
              className="font-mono text-sm"
            />

            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Pratinjau WhatsApp</Label>
              <WhatsappPreview message={draft.body} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={save} disabled={pending}>
            {pending ? "Menyimpan…" : draft.id ? "Simpan perubahan" : "Tambah template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
