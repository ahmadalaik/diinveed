/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorError, EditorField, EditorLabel } from "../../editor-field";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function CoverMobileImageField() {
  const coverMobileImage = useInvitationStore((s) => s.coverMobileImage);
  const coverMobileImageKey = useInvitationStore((s) => s.coverMobileImageKey);
  const errors = useInvitationStore((s) => s.publishErrors?.coverMobileImage);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

  const MAX_SIZE_MB = 12;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(null);
    const { url, key: newKey } = await upload(file, {
      kind: "cover",
      invitationId,
    });
    if (coverMobileImageKey) await remove(coverMobileImageKey);
    set({ coverMobileImage: url, coverMobileImageKey: newKey });
  };

  const handleRemove = async () => {
    if (coverMobileImageKey) await remove(coverMobileImageKey);
    set({ coverMobileImage: null, coverMobileImageKey: null });
  };

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-cover-mobile-image">
        Cover Mobile
      </EditorLabel>
      {coverMobileImage ? (
        <div className="relative max-w-40 max-h-60">
          <img
            src={coverMobileImage}
            alt="Cover Mobile"
            className="w-full object-cover rounded-lg"
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
          className="w-40! h-60 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors shadow-none hover:cursor-pointer"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            {isUploading
              ? `Mengunggah ${uploadProgress}%`
              : "Klik untuk mengunggah gambar"}
          </span>
        </Button>
      )}
      {sizeError && <EditorError errors={[sizeError]} />}
      <Input
        id="basics-cover-mobile-image"
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
