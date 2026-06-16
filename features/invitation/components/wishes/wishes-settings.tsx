"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateWishesOptions } from "@/features/invitation/actions/update-wishes-options";
import type { WishesOptions } from "@/features/invitation/types/invitation.type";

const FIELDS: { key: keyof WishesOptions; label: string; hint: string }[] = [
  { key: "enabled", label: "Tampilkan dinding ucapan", hint: "Tampilkan ucapan di halaman undangan." },
  { key: "reviewMode", label: "Tinjau sebelum tampil", hint: "Ucapan baru harus disetujui dulu." },
  { key: "allowPublic", label: "Izinkan ucapan umum", hint: "Pengunjung non-tamu boleh mengirim ucapan." },
  { key: "showCategory", label: "Tampilkan label kategori", hint: "Tampilkan kategori tamu di samping nama." },
];

export function WishesSettings({ options }: { options: WishesOptions }) {
  const router = useRouter();
  const [state, setState] = useState<WishesOptions>(options);
  const [isPending, startTransition] = useTransition();

  const toggle = (key: keyof WishesOptions, value: boolean) => {
    const previous = state;
    const next = { ...state, [key]: value };
    setState(next);
    startTransition(async () => {
      const result = await updateWishesOptions(next);
      if (!result.success) {
        toast.error(result.message);
        setState(previous); // revert
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Ucapan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor={`wo-${f.key}`}>{f.label}</Label>
              <p className="text-xs text-muted-foreground">{f.hint}</p>
            </div>
            <Switch
              id={`wo-${f.key}`}
              checked={state[f.key]}
              disabled={isPending}
              onCheckedChange={(v) => toggle(f.key, v)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
