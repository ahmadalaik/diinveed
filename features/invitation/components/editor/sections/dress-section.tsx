"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";

const PRESETS = ["Black Tie", "Formal", "Smart Casual", "Casual"];

export function DressSection() {
  const dressCode = useInvitationStore((s) => s.dressCode);
  const set = useInvitationStore((s) => s.set);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Dress Code</Label>
        <Input value={dressCode} onChange={(e) => set({ dressCode: e.target.value })} placeholder="e.g. Black Tie" />
      </div>
      <ToggleGroup
        type="single"
        value={PRESETS.includes(dressCode) ? dressCode : ""}
        onValueChange={(v) => { if (v) set({ dressCode: v }); }}
        className="flex flex-wrap gap-1 justify-start"
      >
        {PRESETS.map((p) => (
          <ToggleGroupItem key={p} value={p} className="text-xs px-2 py-1 h-auto rounded-full">
            {p}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
