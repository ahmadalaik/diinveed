/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { Upload, X } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { EditorField, EditorLabel } from "../editor-field";
import { Input } from "@/components/ui/input";
import { FieldGroup } from "@/components/ui/field";

function CoverImageField() {
  const coverImage = useInvitationStore((s) => s.coverImage);
  const coverImageKey = useInvitationStore((s) => s.coverImageKey);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { url, key: newKey } = await upload(file, { kind: "cover", invitationId });
    if (coverImageKey) await remove(coverImageKey);
    set({ coverImage: url, coverImageKey: newKey });
  };

  const handleRemove = async () => {
    if (coverImageKey) await remove(coverImageKey);
    set({ coverImage: null, coverImageKey: null });
  };

  return (
    <EditorField>
      <EditorLabel htmlFor="coverImage">Cover Image</EditorLabel>
      {coverImage ? (
        <div className="relative">
          <img
            src={coverImage}
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
