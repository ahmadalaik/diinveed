"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTokenUpdate } from "@/features/invitation/hooks/editor-sections/use-token-update";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { EditorField, EditorLabel } from "../../../editor-field";
import { FONT_LIST } from "./data/font-list";

export const TYPOGRAPHY_LABELS = {
  font: "Font",
  appearance: "Appearance",
  size: "Size",
  letterCase: "Letter Case",
};

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

  const filteredFonts = FONT_LIST.filter((font) => {
    const matchSearch = font.label.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Semua" || font.category === category;
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
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Input
            placeholder="Type something"
            value={previewText}
            onChange={(event) => setPreviewText(event.target.value)}
          />

          <Tabs
            value={category}
            onValueChange={setCategory}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList
              variant="line"
              className="w-full shrink-0 justify-start border-b rounded-none group-data-horizontal/tabs:h-auto h-auto p-0 bg-transparent overflow-x-auto"
            >
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="h-auto rounded-md border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 whitespace-nowrap"
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
                    className={cn(
                      "p-4 border rounded-lg hover:border-primary transition-colors text-left space-y-2 cursor-pointer",
                      value === font.value &&
                        "border-primary",
                    )}
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

function TypographyGroupField({
  label,
  group,
}: {
  label: string;
  group: "heading" | "body";
}) {
  const { resolvedTokens, updateTypography, resetTypographyGroup } =
    useTokenUpdate();
  const fontSpec = resolvedTokens.typography[group];

  return (
    <FieldSet className="space-y-0">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLegend className="text-[13px]! font-medium text-muted-foreground uppercase mb-0 border-none pb-0">
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
        <div className="p-4 bg-muted rounded-lg flex items-center justify-center min-h-20 overflow-hidden">
          <span
            className={cn(
              "text-center",
              group === "heading" ? "text-xl" : "text-sm",
            )}
            style={{
              fontFamily: fontSpec.family,
              fontWeight: fontSpec.weight,
              textTransform:
                fontSpec.transform !== "none" ? fontSpec.transform : undefined,
            }}
          >
            Lorem ipsum is simply dummy text
          </span>
        </div>
      </div>

      <FieldGroup className="gap-4">
        <EditorField>
          <EditorLabel htmlFor={`${group}-font`} className="text-xs">
            {TYPOGRAPHY_LABELS.font}
          </EditorLabel>
          <FontPickerDialog
            value={fontSpec.family}
            onValueChange={(val) => updateTypography(group, "family", val)}
          >
            <Button
              variant="outline"
              className="w-full justify-between font-normal px-2.5 py-2 h-auto text-[13px] border-transparent bg-muted/60 shadow-none hover:bg-muted focus-visible:bg-background transition-all"
            >
              <span className="truncate">
                {FONT_LIST.find((font) => font.value === fontSpec.family)
                  ?.label || fontSpec.family}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </FontPickerDialog>
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
