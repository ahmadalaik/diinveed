"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  getTemplateTokens,
  type TemplateTokenOverrides,
} from "@/features/template/tokens";

type ColorKey = "primary" | "secondary" | "tertiary";

const COLOR_LABELS: Record<ColorKey, string> = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
};

export function ThemeSection() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const tokenOverrides = useInvitationStore((s) => s.tokenOverrides);
  const set = useInvitationStore((s) => s.set);

  const base = getTemplateTokens(templateSlug);

  const updateColor = (key: ColorKey, value: string) => {
    set({
      tokenOverrides: {
        ...tokenOverrides,
        colors: { ...tokenOverrides?.colors, [key]: value },
      },
    });
  };

  const resetColors = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { colors: _removed, ...rest } = tokenOverrides ?? {};
    const cleaned =
      Object.keys(rest).length > 0 ? (rest as TemplateTokenOverrides) : null;
    set({ tokenOverrides: cleaned });
  };

  const colors: Record<ColorKey, string> = {
    primary: tokenOverrides?.colors?.primary ?? base.colors.primary,
    secondary: tokenOverrides?.colors?.secondary ?? base.colors.secondary,
    tertiary: tokenOverrides?.colors?.tertiary ?? base.colors.tertiary,
  };

  return (
    <div className="space-y-3">
      {(["primary", "secondary", "tertiary"] as const).map((key) => (
        <div key={key}>
          <Label className="text-xs">{COLOR_LABELS[key]}</Label>
          <div className="flex gap-2 items-center mt-1">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => updateColor(key, e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border p-0.5 bg-transparent shrink-0"
            />
            <Input
              value={colors[key]}
              onChange={(e) => updateColor(key, e.target.value)}
              className="h-8 text-xs font-mono"
            />
            {tokenOverrides?.colors?.[key] && (
              <span className="text-xs text-amber-500 shrink-0">custom</span>
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
          Reset ke default template
        </Button>
      )}
    </div>
  );
}
