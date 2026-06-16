"use client";

import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { useTokenUpdate } from "@/features/invitation/hooks/editor-sections/use-token-update";
import { EditorField, EditorLabel } from "../../editor-field";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

const TYPOGRAPHY_LABELS = {
  font: "Font",
  appearance: "Appearance",
  size: "Size",
  letterCase: "Letter Case",
};

const FONT_LIST = [
  { label: "Inter", category: "Sans Serif", value: "var(--font-sans)" },
  { label: "Geist", category: "Sans Serif", value: "var(--font-geist-sans)" },
  { label: "Montserrat", category: "Sans Serif", value: "var(--font-montserrat)" },
  { label: "Outfit", category: "Sans Serif", value: "var(--font-outfit)" },
  { label: "Plus Jakarta", category: "Sans Serif", value: "var(--font-jakarta)" },
  
  { label: "Cormorant", category: "Serif", value: "var(--font-serif)" },
  { label: "Lora", category: "Serif", value: "var(--font-lora)" },
  { label: "Fraunces", category: "Serif", value: "var(--font-fraunces)" },

  { label: "Great Vibes", category: "Handwriting", value: "var(--font-script)" },
  { label: "Dancing Script", category: "Handwriting", value: "var(--font-dancing)" },
  { label: "Caveat", category: "Handwriting", value: "var(--font-caveat)" },

  { label: "Geist Mono", category: "Monospace", value: "var(--font-geist-mono)" },
  { label: "Fira Code", category: "Monospace", value: "var(--font-fira)" },
];

const CATEGORIES = ["Semua", "Sans Serif", "Serif", "Handwriting", "Monospace"];

interface FontPickerProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}

function FontPickerDialog({ value, onValueChange, children }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [previewText, setPreviewText] = useState(
    "Lorem Ipsum is simply dummy text",
  );
  const [category, setCategory] = useState("Semua");

  const filteredFonts = FONT_LIST.filter((f) => {
    const matchSearch = f.label.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua" || f.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle>Pilih Font</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4 flex flex-col flex-1 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fonts"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Input
            placeholder="Type something"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
          />

          <Tabs
            value={category}
            onValueChange={setCategory}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 whitespace-nowrap"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((cat) => (
              <TabsContent
                key={cat}
                value={cat}
                className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2 outline-none"
              >
                {filteredFonts.map((font) => (
                  <div
                    key={font.value}
                    role="button"
                    onClick={() => {
                      onValueChange(font.value);
                      setOpen(false);
                    }}
                    className={`p-4 border rounded-lg hover:border-primary transition-colors text-left space-y-2 cursor-pointer ${value === font.value ? "border-primary ring-1 ring-primary" : ""}`}
                  >
                    <div className="text-xs text-muted-foreground">
                      {font.label}
                    </div>
                    <div
                      className="text-2xl truncate"
                      style={{ fontFamily: font.value }}
                    >
                      {previewText || "Lorem Ipsum is simply dummy text"}
                    </div>
                  </div>
                ))}
                {filteredFonts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Font tidak ditemukan.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TypographyGroupField({ label, group }: { label: string; group: "heading" | "body" }) {
  const { resolvedTokens, updateTypography, resetTypographyGroup } = useTokenUpdate();
  const fontSpec = resolvedTokens.typography[group];

  const sizeNum = parseFloat(fontSpec.size) || 1;

  return (
    <FieldSet className="space-y-4">
      {/* Preview & Reset */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLegend className="text-[10.5px] font-medium tracking-[0.04em] text-muted-foreground uppercase mb-0 border-none pb-0">
            {label}
          </FieldLegend>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => resetTypographyGroup(group)}
            className="h-auto p-0 text-xs text-destructive hover:bg-transparent hover:text-destructive/80 hover:underline"
          >
            Reset
          </Button>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-center min-h-[80px] overflow-hidden">
          <span
            className="text-center"
            style={{
              fontFamily: fontSpec.family,
              fontSize: fontSpec.size,
              fontWeight: fontSpec.weight,
              textTransform: fontSpec.transform !== "none" ? fontSpec.transform : undefined,
            }}
          >
            Lorem Ipsum is simply dummy text
          </span>
        </div>
      </div>

      <FieldGroup className="space-y-4">
        {/* Font Picker */}
        <EditorField>
          <EditorLabel htmlFor={`${group}-font`} className="text-xs">
            {TYPOGRAPHY_LABELS.font}
          </EditorLabel>
          <FontPickerDialog
            value={fontSpec.family}
            onValueChange={(val) => updateTypography(group, "family", val)}
          >
            <Button variant="outline" className="w-full justify-between font-normal px-3 py-2 h-auto text-sm">
              <span className="truncate">
                {FONT_LIST.find((f) => f.value === fontSpec.family)?.label ||
                  fontSpec.family}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </FontPickerDialog>
        </EditorField>

        <div className="flex gap-4">
          {/* Appearance */}
          <EditorField className="flex-1">
            <EditorLabel className="text-xs">{TYPOGRAPHY_LABELS.appearance}</EditorLabel>
            <Select
              value={fontSpec.weight.toString()}
              onValueChange={(v) => updateTypography(group, "weight", parseInt(v))}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300" className="text-xs">Light</SelectItem>
                <SelectItem value="400" className="text-xs">Regular</SelectItem>
                <SelectItem value="500" className="text-xs">Medium</SelectItem>
                <SelectItem value="600" className="text-xs">Semi Bold</SelectItem>
                <SelectItem value="700" className="text-xs">Bold</SelectItem>
              </SelectContent>
            </Select>
          </EditorField>

          {/* Size */}
          <EditorField className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <EditorLabel className="text-xs mb-0">{TYPOGRAPHY_LABELS.size}</EditorLabel>
            </div>
            <div className="flex items-center gap-3 h-9">
              <span className="text-xs font-serif italic">A</span>
              <Slider
                value={[sizeNum]}
                min={0.5}
                max={4}
                step={0.1}
                onValueChange={([val]) => updateTypography(group, "size", `${val}rem`)}
              />
              <span className="text-lg font-serif italic">A</span>
            </div>
          </EditorField>
        </div>

        {/* Letter Case */}
        <EditorField>
          <EditorLabel className="text-xs">{TYPOGRAPHY_LABELS.letterCase}</EditorLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            value={fontSpec.transform}
            onValueChange={(v) => {
              if (v) updateTypography(group, "transform", v);
            }}
            className="justify-start gap-2 h-9"
          >
            <ToggleGroupItem value="none" className="flex-1 px-0 h-full">-</ToggleGroupItem>
            <ToggleGroupItem value="uppercase" className="flex-1 px-0 h-full">AG</ToggleGroupItem>
            <ToggleGroupItem value="lowercase" className="flex-1 px-0 h-full">ag</ToggleGroupItem>
            <ToggleGroupItem value="capitalize" className="flex-1 px-0 h-full">Ag</ToggleGroupItem>
          </ToggleGroup>
        </EditorField>
      </FieldGroup>
    </FieldSet>
  );
}

export function TypographyHeadingField() {
  return <TypographyGroupField label="Heading" group="heading" />;
}

export function TypographyBodyField() {
  return <TypographyGroupField label="Body" group="body" />;
}
