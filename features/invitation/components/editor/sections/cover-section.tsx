/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { EditorError, EditorField, EditorLabel } from "../editor-field";
import { Input } from "@/components/ui/input";
import { FieldGroup } from "@/components/ui/field";

function CoverImageField() {
  const coverDesktopImage = useInvitationStore((s) => s.coverDesktopImage);
  const coverDesktopImageKey = useInvitationStore((s) => s.coverDesktopImageKey);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB. File ini ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(null);
    const { url, key: newKey } = await upload(file, { kind: "cover", invitationId });
    if (coverDesktopImageKey) await remove(coverDesktopImageKey);
    set({ coverDesktopImage: url, coverDesktopImageKey: newKey });
  };

  const handleRemove = async () => {
    if (coverDesktopImageKey) await remove(coverDesktopImageKey);
    set({ coverDesktopImage: null, coverDesktopImageKey: null });
  };

  return (
    <EditorField>
      <EditorLabel htmlFor="coverImage">Cover Image</EditorLabel>
      {coverDesktopImage ? (
        <div className="relative">
          <img
            src={coverDesktopImage}
            alt="Cover"
            className="w-full h-40 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors shadow-none"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {isUploading
              ? `Mengunggah ${uploadProgress}%`
              : "Klik untuk unggah"}
          </span>
        </Button>
      )}
      {sizeError && (
        <EditorError className="text-xs text-destructive">{sizeError}</EditorError>
      )}
      <Input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </EditorField>
  );
}

export function CoverSection() {
  return (
    <FieldGroup>
      <CoverImageField />
    </FieldGroup>
  );
}
