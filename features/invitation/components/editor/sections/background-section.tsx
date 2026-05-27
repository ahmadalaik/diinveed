"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BACKGROUND_TYPES } from "@/features/invitation/configs/background";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";

export function BackgroundSection() {
  const backgroundType = useInvitationStore((s) => s.backgroundType);
  const set = useInvitationStore((s) => s.set);

  return (
    <ToggleGroup
      type="single"
      value={backgroundType}
      onValueChange={(v) => {
        if (v) set({ backgroundType: v });
      }}
      className="flex flex-wrap gap-1 justify-start"
    >
      {BACKGROUND_TYPES.map((bg) => (
        <ToggleGroupItem
          key={bg.id}
          value={bg.id}
          className="px-3 py-1.5 text-xs h-auto rounded-full"
        >
          {bg.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
