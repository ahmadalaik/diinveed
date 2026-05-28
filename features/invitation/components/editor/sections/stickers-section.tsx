"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { STICKERS } from "@/features/invitation/configs/stickers";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";

export function StickersSection() {
  const stickers = useInvitationStore((s) => s.stickers);
  const set = useInvitationStore((s) => s.set);

  return (
    <ToggleGroup
      type="multiple"
      value={stickers}
      onValueChange={(v) => set({ stickers: v })}
      className="grid grid-cols-5 gap-2"
    >
      {STICKERS.map((sticker) => (
        <ToggleGroupItem
          key={sticker.id}
          value={sticker.id}
          title={sticker.label}
          className="h-10 w-full rounded-lg text-xl"
        >
          {sticker.glyph}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
