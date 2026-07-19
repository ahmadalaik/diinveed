/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorError,
  EditorField,
  EditorHint,
  EditorLabel,
} from "../../../editor-field";

const MAX_SIZE_BYTES = 12 * 1024 * 1024;

export function SceneCoupleImageField() {
  const image = useInvitationStore((state) => state.coupleSceneImage);
  const storedKey = useInvitationStore((state) => state.coupleSceneImageKey);
  const invitationId = useInvitationStore((state) => state.id);
  const set = useInvitationStore((state) => state.set);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setError("Ukuran gambar maksimal 12MB.");
      return;
    }

    setError(null);
    try {
      const uploaded = await upload(file, {
        kind: "couple",
        invitationId,
        maxImageEdge: 1600,
      });
      if (storedKey) await remove(storedKey);
      set({
        coupleSceneImage: uploaded.url,
        coupleSceneImageKey: uploaded.key,
      });
    } catch {
      setError("Gambar gagal diunggah. Silakan coba lagi.");
    }
  }

  async function handleRemove() {
    if (storedKey) await remove(storedKey);
    set({ coupleSceneImage: null, coupleSceneImageKey: null });
  }

  return (
    <EditorField data-invalid={Boolean(error)}>
      <EditorLabel htmlFor="couple-scene-image">
        Gambar pasangan untuk scene
      </EditorLabel>
      <EditorHint>
        Opsional. Gunakan PNG transparan; sisi terpanjang diproses hingga 1.600
        px.
      </EditorHint>

      {image ? (
        <div className="flex items-start gap-3">
          <img
            src={image}
            alt="Pratinjau pasangan untuk scene"
            className="aspect-4/5 w-28 rounded-md border object-cover"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" disabled={isUploading}>
                {isUploading ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <ImageIcon data-icon="inline-start" />
                )}
                Kelola gambar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => inputRef.current?.click()}>
                  <Upload />
                  Ganti gambar
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={handleRemove}>
                  <Trash2 />
                  Hapus gambar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Upload data-icon="inline-start" />
          )}
          {isUploading && uploadProgress > 0
            ? `Mengunggah ${uploadProgress}%`
            : "Unggah gambar scene"}
        </Button>
      )}

      <Input
        ref={inputRef}
        id="couple-scene-image"
        type="file"
        accept="image/*"
        aria-label="Gambar pasangan untuk scene"
        aria-invalid={Boolean(error)}
        className="hidden"
        onChange={handleFile}
      />
      <EditorError errors={error ? [error] : undefined} />
    </EditorField>
  );
}
