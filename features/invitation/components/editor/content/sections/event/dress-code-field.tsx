"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorHint,
  EditorLabel,
  EditorTextarea,
} from "../../../editor-field";

const DEFAULT_COLORS = ["#334433", "#D4AF72"];

export function DressCodeField() {
  const dressCode = useInvitationStore((state) => state.dressCode);
  const set = useInvitationStore((state) => state.set);

  function update(patch: Partial<typeof dressCode>) {
    set({ dressCode: { ...dressCode, ...patch } });
  }

  function updateColor(index: number, hex: string) {
    const colors = dressCode.colors.map((color, colorIndex) =>
      colorIndex === index ? hex : color,
    );
    update({ colors });
  }

  function toggle(enabled: boolean) {
    update({
      enabled,
      colors:
        enabled && dressCode.colors.length < 2
          ? DEFAULT_COLORS
          : dressCode.colors,
    });
  }

  return (
    <FieldGroup>
      <EditorField orientation="horizontal">
        <div className="flex flex-1 flex-col gap-1">
          <EditorLabel htmlFor="dress-code-enabled">
            Aktifkan dress code
          </EditorLabel>
          <EditorHint>Tampilkan panduan busana dan palet warna.</EditorHint>
        </div>
        <Switch
          id="dress-code-enabled"
          aria-label="Aktifkan dress code"
          checked={dressCode.enabled}
          onCheckedChange={toggle}
        />
      </EditorField>

      {dressCode.enabled ? (
        <>
          <EditorField>
            <EditorLabel htmlFor="dress-code-description">
              Deskripsi dress code
            </EditorLabel>
            <EditorTextarea
              id="dress-code-description"
              value={dressCode.description}
              placeholder="Contoh: Earth tones atau batik nusantara"
              onChange={(event) => update({ description: event.target.value })}
            />
          </EditorField>

          <EditorField>
            <EditorLabel>Palet warna</EditorLabel>
            <div className="flex flex-col gap-2">
              {dressCode.colors.map((color, index) => (
                <div
                  key={`${index}-${color}`}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="color"
                    aria-label={`Warna dress code ${index + 1}`}
                    value={color}
                    onChange={(event) => updateColor(index, event.target.value)}
                    className="size-9 shrink-0 p-1"
                  />
                  <Input
                    aria-label={`Kode warna dress code ${index + 1}`}
                    value={color}
                    maxLength={7}
                    onChange={(event) => updateColor(index, event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Hapus warna ${index + 1}`}
                    disabled={dressCode.colors.length <= 2}
                    onClick={() =>
                      update({
                        colors: dressCode.colors.filter(
                          (_, colorIndex) => colorIndex !== index,
                        ),
                      })
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={dressCode.colors.length >= 5}
              onClick={() =>
                update({ colors: [...dressCode.colors, "#F2E8CF"] })
              }
            >
              <Plus data-icon="inline-start" />
              Tambah warna
            </Button>
          </EditorField>
        </>
      ) : null}
    </FieldGroup>
  );
}
