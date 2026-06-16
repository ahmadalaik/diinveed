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
import { Camera, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImageCropperDialog } from "../../image-cropper-dialog";

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
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const MAX_SIZE_MB = 12;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const [sizeError, setSizeError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(null);
    setSrc(URL.createObjectURL(file));
    setOpen(true);
    e.target.value = "";
  };

  const handleCropped = async (blob: Blob) => {
    const file = new File([blob], "photo.webp", { type: "image/webp" });
    const { url, key: newKey } = await upload(file, {
      kind: "couple",
      invitationId,
    });
    if (storedKey) await remove(storedKey);

    set({ [imageKey]: url, [keyProp]: newKey } as Partial<InvitationState>);
    setOpen(false);
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  };

  const handleRemove = async () => {
    if (storedKey) await remove(storedKey);
    set({ [imageKey]: null, [keyProp]: null } as Partial<InvitationState>);
  };

  return (
    <EditorField>
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
                className="relative h-24 w-24 rounded-full p-0  outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 hover:cursor-pointer"
              >
                <img
                  src={image}
                  alt={label}
                  className="h-24 w-24 rounded-full border object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm">
                  <Camera className="h-3.5 w-3.5" />
                </span>
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
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50 shadow-none hover:cursor-pointer"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Klik untuk menggungah foto
          </span>
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
      <ImageCropperDialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o && src) {
            URL.revokeObjectURL(src);
            setSrc(null);
          }
        }}
        imageSrc={src}
        onCropped={handleCropped}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        title={`Sesuaikan ${label}`}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}
