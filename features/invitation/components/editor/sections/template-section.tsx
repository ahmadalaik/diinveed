"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TOKENS } from "@/features/template/tokens";

export function TemplateSection() {
  const tokenId = useInvitationStore((s) => s.tokenId);
  const set = useInvitationStore((s) => s.set);

  return (
    <ToggleGroup
      type="single"
      value={tokenId}
      onValueChange={(v) => {
        if (v) set({ tokenId: v, tokenOverrides: null });
      }}
      className="grid grid-cols-3 gap-2"
    >
      {TOKENS.map((token) => (
        <ToggleGroupItem
          key={token.theme}
          value={token.theme}
          className="rounded-lg border-2 p-2 flex flex-col items-center gap-1 h-auto data-[state=on]:border-primary"
          style={{ backgroundColor: token.colors.background }}
        >
          <span
            className="text-[10px] font-medium truncate w-full text-center"
            style={{
              color: token.colors.primary,
              fontFamily: token.typography.heading,
            }}
          >
            {token.name}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
