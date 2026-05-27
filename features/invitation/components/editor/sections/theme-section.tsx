"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { getToken, TokenOverrides } from "@/features/template/tokens";

export function ThemeSection() {
  const tokenId = useInvitationStore((s) => s.tokenId);
  const tokenOverrides = useInvitationStore((s) => s.tokenOverrides);
  const set = useInvitationStore((s) => s.set);
  const base = getToken(tokenId);

  const updateColor = (
    key: "primary" | "accent" | "background",
    value: string,
  ) => {
    set({
      tokenOverrides: {
        ...tokenOverrides,
        colors: { ...tokenOverrides?.colors, [key]: value },
      },
    });
  };

  const resetColors = () => {
    const { colors: _removed, ...rest } = tokenOverrides ?? {};
    const cleaned =
      Object.keys(rest).length > 0 ? (rest as TokenOverrides) : null;

    set({ tokenOverrides: cleaned });
  };

  if (!base) return null;

  const colors = {
    primary: tokenOverrides?.colors?.primary ?? base.colors.primary,
    accent: tokenOverrides?.colors?.accent ?? base.colors.accent,
    background: tokenOverrides?.colors?.background ?? base.colors.background,
  };

  return (
    <div className="space-y-3">
      {(["primary", "accent", "background"] as const).map((key) => (
        <div key={key}>
          <Label className="text-xs capitalize">{key} Color</Label>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => updateColor(key, e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border p-0.5 bg-transparent"
            />
            <span className="text-xs text-muted-foreground font-mono">
              {colors[key]}
            </span>
            {tokenOverrides?.colors?.[key] && (
              <span className="text-xs text-amber-500 ml-auto">custom</span>
            )}
          </div>
        </div>
      ))}
      {tokenOverrides?.colors && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={resetColors}
        >
          Reset to template defaults
        </Button>
      )}
    </div>
  );
}
