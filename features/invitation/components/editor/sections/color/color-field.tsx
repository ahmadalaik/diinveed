"use client";

import { FieldSet, FieldLegend, FieldGroup } from "@/components/ui/field";
import { EditorField, EditorLabel, EditorInput } from "../../editor-field";
import { useTokenUpdate } from "@/features/invitation/hooks/editor-sections/use-token-update";
import { Button } from "@/components/ui/button";

const COLOR_LABELS = {
  primary: "Primary",
  secondary: "Secondary",
  tertiary: "Tertiary",
};

export function ColorBackgroundField() {
  const { resolvedTokens, updateColor, resetColorGroup } = useTokenUpdate();
  const background = resolvedTokens.colors.background;

  return (
    <FieldSet className="space-y-1.5">
      <div className="flex items-center justify-between">
        <FieldLegend className="text-[10.5px] font-medium tracking-[0.04em] text-muted-foreground uppercase mb-0 border-none pb-0">
          Background
        </FieldLegend>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => resetColorGroup("background")}
          className="h-auto p-0 text-xs text-destructive hover:bg-transparent hover:text-destructive/80 hover:underline"
        >
          Reset
        </Button>
      </div>
      
      <FieldGroup className="flex gap-2">
        <EditorField>
          <EditorLabel htmlFor="bg-primary" className="sr-only">
            {COLOR_LABELS.primary}
          </EditorLabel>
          <EditorInput
            id="bg-primary"
            type="color"
            className="p-1 size-8"
            value={background?.primary || "#000000"}
            onChange={(e) => updateColor("background", "primary", e.target.value)}
          />
        </EditorField>

        <EditorField>
          <EditorLabel htmlFor="bg-secondary" className="sr-only">
            {COLOR_LABELS.secondary}
          </EditorLabel>
          <EditorInput
            id="bg-secondary"
            type="color"
            className="p-1 size-8"
            value={background?.secondary || "#000000"}
            onChange={(e) => updateColor("background", "secondary", e.target.value)}
          />
        </EditorField>

        <EditorField>
          <EditorLabel htmlFor="bg-tertiary" className="sr-only">
            {COLOR_LABELS.tertiary}
          </EditorLabel>
          <EditorInput
            id="bg-tertiary"
            type="color"
            className="p-1 size-8"
            value={background?.tertiary || "#000000"}
            onChange={(e) => updateColor("background", "tertiary", e.target.value)}
          />
        </EditorField>
      </FieldGroup>
    </FieldSet>
  );
}

export function ColorTextField() {
  const { resolvedTokens, updateColor, resetColorGroup } = useTokenUpdate();
  const text = resolvedTokens.colors.text;

  return (
    <FieldSet className="space-y-1.5">
      <div className="flex items-center justify-between">
        <FieldLegend className="text-[10.5px] font-medium tracking-[0.04em] text-muted-foreground uppercase mb-0 border-none pb-0">
          Text
        </FieldLegend>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => resetColorGroup("text")}
          className="h-auto p-0 text-xs text-destructive hover:bg-transparent hover:text-destructive/80 hover:underline"
        >
          Reset
        </Button>
      </div>
      
      <FieldGroup className="flex gap-2">
        <EditorField>
          <EditorLabel htmlFor="text-primary" className="sr-only">
            {COLOR_LABELS.primary}
          </EditorLabel>
          <EditorInput
            id="text-primary"
            type="color"
            className="p-1 size-8"
            value={text?.primary || "#000000"}
            onChange={(e) => updateColor("text", "primary", e.target.value)}
          />
        </EditorField>

        <EditorField>
          <EditorLabel htmlFor="text-secondary" className="sr-only">
            {COLOR_LABELS.secondary}
          </EditorLabel>
          <EditorInput
            id="text-secondary"
            type="color"
            className="p-1 size-8"
            value={text?.secondary || "#000000"}
            onChange={(e) => updateColor("text", "secondary", e.target.value)}
          />
        </EditorField>

        <EditorField>
          <EditorLabel htmlFor="text-tertiary" className="sr-only">
            {COLOR_LABELS.tertiary}
          </EditorLabel>
          <EditorInput
            id="text-tertiary"
            type="color"
            className="p-1 size-8"
            value={text?.tertiary || "#000000"}
            onChange={(e) => updateColor("text", "tertiary", e.target.value)}
          />
        </EditorField>
      </FieldGroup>
    </FieldSet>
  );
}

export function ColorButtonField() {
  const { resolvedTokens, updateColor, resetColorGroup } = useTokenUpdate();
  const button = resolvedTokens.colors.button;

  return (
    <FieldSet className="space-y-1.5">
      <div className="flex items-center justify-between">
        <FieldLegend className="text-[10.5px] font-medium tracking-[0.04em] text-muted-foreground uppercase mb-0 border-none pb-0">
          Button
        </FieldLegend>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => resetColorGroup("button")}
          className="h-auto p-0 text-xs text-destructive hover:bg-transparent hover:text-destructive/80 hover:underline"
        >
          Reset
        </Button>
      </div>
      
      <FieldGroup className="flex gap-2">
        <EditorField>
          <EditorLabel htmlFor="btn-primary" className="sr-only">
            {COLOR_LABELS.primary}
          </EditorLabel>
          <EditorInput
            id="btn-primary"
            type="color"
            className="p-1 size-8"
            value={button?.primary || "#000000"}
            onChange={(e) => updateColor("button", "primary", e.target.value)}
          />
        </EditorField>

        <EditorField>
          <EditorLabel htmlFor="btn-secondary" className="sr-only">
            {COLOR_LABELS.secondary}
          </EditorLabel>
          <EditorInput
            id="btn-secondary"
            type="color"
            className="p-1 size-8"
            value={button?.secondary || "#000000"}
            onChange={(e) => updateColor("button", "secondary", e.target.value)}
          />
        </EditorField>
      </FieldGroup>
    </FieldSet>
  );
}
