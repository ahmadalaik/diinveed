/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ChangeEvent, useRef } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
} from "../editor-field";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InvitationUrlSection } from "./invitation-url-section";
import { MusicField } from "./music-field";

function CoverImageField() {
  const coverImage = useInvitationStore((s) => s.coverImage);
  const coverImageKey = useInvitationStore((s) => s.coverImageKey);
  const errors = useInvitationStore((s) => s.publishErrors?.coverImage);
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
      <EditorLabel htmlFor="basics-cover-image">Cover Image</EditorLabel>
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
            className="absolute top-2 right-2 h-6 w-6 bg-white/90 hover:bg-white"
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
      <EditorError errors={errors} />
    </EditorField>
  );
}

function CoupleField() {
  const title = useInvitationStore((s) => s.title);
  const errors = useInvitationStore((s) => s.publishErrors?.title);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-couple">Couple</EditorLabel>
      <EditorInput
        id="basics-couple"
        value={title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="e.g. Amelia & Theo"
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

export function BasicsSection() {
  return (
    <FieldGroup className="gap-3">
      <CoverImageField />
      <MusicField />
      <CoupleField />
      <InvitationUrlSection />
    </FieldGroup>
  );
};
