"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  getTemplateTokens,
  type FontSpec,
  type TemplateTokenOverrides,
  type TextTransform,
} from "@/features/template/tokens";

type FontGroup = "display" | "heading" | "body";

const FONT_OPTIONS = [
  { label: "Script — Great Vibes", value: "var(--font-script)" },
  { label: "Serif — Cormorant", value: "var(--font-serif)" },
  { label: "Sans — Montserrat", value: "var(--font-montserrat)" },
  { label: "Sans — Inter", value: "var(--font-sans)" },
];

const TRANSFORM_OPTIONS: { label: string; value: TextTransform }[] = [
  { label: "Normal", value: "none" },
  { label: "UPPERCASE", value: "uppercase" },
  { label: "Capitalize", value: "capitalize" },
  { label: "lowercase", value: "lowercase" },
];

const GROUP_LABELS: Record<FontGroup, string> = {
  display: "Display (nama mempelai)",
  heading: "Heading",
  body: "Body",
};

export function FontSection() {
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const tokenOverrides = useInvitationStore((s) => s.tokenOverrides);
  const set = useInvitationStore((s) => s.set);

  const base = getTemplateTokens(templateSlug);

  const updateFont = (group: FontGroup, patch: Partial<FontSpec>) => {
    set({
      tokenOverrides: {
        ...tokenOverrides,
        typography: {
          ...tokenOverrides?.typography,
          [group]: { ...tokenOverrides?.typography?.[group], ...patch },
        },
      },
    });
  };

  const resetTypography = () => {
    const { typography: _removed, ...rest } = tokenOverrides ?? {};
    const cleaned =
      Object.keys(rest).length > 0 ? (rest as TemplateTokenOverrides) : null;
    set({ tokenOverrides: cleaned });
  };

  const familyOf = (group: FontGroup) =>
    tokenOverrides?.typography?.[group]?.family ?? base.typography[group].family;

  const headingTransform =
    tokenOverrides?.typography?.heading?.transform ??
    base.typography.heading.transform;

  return (
    <div className="space-y-4">
      {(["display", "heading", "body"] as const).map((group) => (
        <div key={group} className="space-y-1.5">
          <Label className="text-xs">{GROUP_LABELS[group]}</Label>
          <Select
            value={familyOf(group)}
            onValueChange={(v) => updateFont(group, { family: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Pilih font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="space-y-1.5">
        <Label className="text-xs">Kapitalisasi Heading</Label>
        <Select
          value={headingTransform}
          onValueChange={(v) =>
            updateFont("heading", { transform: v as TextTransform })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Kapitalisasi" />
          </SelectTrigger>
          <SelectContent>
            {TRANSFORM_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value} className="text-xs">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {tokenOverrides?.typography && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={resetTypography}
        >
          Reset ke default template
        </Button>
      )}
    </div>
  );
}
