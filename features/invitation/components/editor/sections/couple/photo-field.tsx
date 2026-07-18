/* eslint-disable @next/next/no-img-element */
"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useRef, useState } from "react";
import { EditorError, EditorField, EditorLabel } from "../../editor-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface Props {
  label: string;
  imageKey: "brideImage" | "groomImage";
  keyProp: "brideImageKey" | "groomImageKey";
}

export function PhotoField({ label, imageKey, keyProp }: Props) {
  const image = useInvitationStore((s) => s[imageKey]);
  const storedKey = useInvitationStore((s) => s[keyProp]);
  const errors = useInvitationStore((s) => s.publishErrors?.[imageKey]);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

  const fileRef = useRef<HTMLInputElement>(null);

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
    e.target.value = "";

    try {
      const { url, key: newKey } = await upload(file, {
        kind: "couple",
        invitationId,
      });
      if (storedKey) await remove(storedKey);

      set({ [imageKey]: url, [keyProp]: newKey } as Partial<InvitationState>);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async () => {
    if (storedKey) await remove(storedKey);
    set({ [imageKey]: null, [keyProp]: null } as Partial<InvitationState>);
  };

  return (
    <EditorField publishField={imageKey} invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor={imageKey}>{label}</EditorLabel>
      {image ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                type="button"
                disabled={isUploading}
                aria-label={`Ubah ${label}`}
                aria-invalid={Boolean(errors?.length)}
                className="relative aspect-4/5 h-auto w-full max-w-36 overflow-hidden rounded-lg p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 hover:cursor-pointer"
              >
                {isUploading ? (
                  <span className="flex size-full flex-col items-center justify-center gap-2 px-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <Progress value={uploadProgress} className="h-1 w-16" />
                  </span>
                ) : (
                  <>
                    <img
                      src={image}
                      alt={label}
                      className="aspect-4/5 w-full rounded-lg border object-cover"
                    />
                    <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm">
                      <Camera className="h-3.5 w-3.5" />
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Ganti foto
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="hover:cursor-pointer"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4" />
                Hapus foto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button
          id={imageKey}
          variant="outline"
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          aria-invalid={Boolean(errors?.length)}
          className="flex aspect-4/5 h-auto w-full max-w-36 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed shadow-none transition-colors hover:bg-muted/50 hover:cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <Progress value={uploadProgress} className="h-1 w-16" />
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                Klik untuk menggungah foto
              </span>
            </>
          )}
        </Button>
      )}
      {sizeError && <EditorError errors={[sizeError]} />}
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
