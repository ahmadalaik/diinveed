/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { FieldGroup } from "@/components/ui/field";
import { Camera, Trash2, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCloudinaryUpload } from "@/features/template/hooks/use-cloudinary-upload";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { ImageCropperDialog } from "../image-cropper-dialog";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";

function BrideNameField() {
  const brideName = useInvitationStore((s) => s.brideName);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="brideName">Nama Mempelai Wanita</EditorLabel>
      <EditorInput
        id="brideName"
        autoComplete="off"
        placeholder="Citra Maharani"
        value={brideName}
        onChange={(e) => set({ brideName: e.target.value })}
      />
    </EditorField>
  );
}

function BrideNicknameField() {
  const brideNickname = useInvitationStore((s) => s.brideNickname);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="brideNickname">Nama Panggilan Mempelai Wanita</EditorLabel>
      <EditorInput
        id="brideNickname"
        autoComplete="off"
        placeholder="Citra"
        value={brideNickname}
        onChange={(e) => set({ brideNickname: e.target.value })}
      />
    </EditorField>
  );
}

function BrideDescField() {
  const brideDesc = useInvitationStore((s) => s.brideDescription);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="brideDesc">Deskripsi</EditorLabel>
      <EditorTextarea
        id="brideDesc"
        placeholder="Putri kedua dari Bapak Widodo dan Ibu Endang"
        value={brideDesc ?? ""}
        onChange={(e) => set({ brideDescription: e.target.value })}
      />
    </EditorField>
  );
}

function GroomNameField() {
  const groomName = useInvitationStore((s) => s.groomName);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="groomName">Nama Mempelai Pria</EditorLabel>
      <EditorInput
        id="groomName"
        autoComplete="off"
        placeholder="Deni Prasetyo"
        value={groomName}
        onChange={(e) => set({ groomName: e.target.value })}
      />
    </EditorField>
  );
}

function GroomNicknameField() {
  const groomNickname = useInvitationStore((s) => s.groomNickname);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="groomNickname">Nama Panggilan Mempelai Pria</EditorLabel>
      <EditorInput
        id="groomNickname"
        autoComplete="off"
        placeholder="Deni"
        value={groomNickname}
        onChange={(e) => set({ groomNickname: e.target.value })}
      />
    </EditorField>
  );
}

function GroomDescField() {
  const groomDesc = useInvitationStore((s) => s.groomDescription);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="groomDesc">Deskripsi</EditorLabel>
      <EditorTextarea
        id="groomDesc"
        placeholder="Putra pertama dari Bapak Teguh dan Ibu Wahyuni"
        value={groomDesc ?? ""}
        onChange={(e) => set({ groomDescription: e.target.value })}
      />
    </EditorField>
  );
}

function PhotoField({
  label,
  imageKey,
  publicIdKey,
}: {
  label: string;
  imageKey: "brideImage" | "groomImage";
  publicIdKey: "brideImagePublicId" | "groomImagePublicId";
}) {
  const image = useInvitationStore((s) => s[imageKey]);
  const publicId = useInvitationStore((s) => s[publicIdKey]);
  const set = useInvitationStore((s) => s.set);
  const { upload, remove, isUploading } = useCloudinaryUpload();

  const fileRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSrc(URL.createObjectURL(file));
    setOpen(true);
    e.target.value = "";
  };

  const handleCropped = async (blob: Blob) => {
    const file = new File([blob], "photo.webp", { type: "image/webp" });
    const { url, publicId: newId } = await upload(file);
    if (publicId) await remove(publicId);

    set({ [imageKey]: url, [publicIdKey]: newId } as Partial<InvitationState>);
    setOpen(false);
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  };

  const handleRemove = async () => {
    if (publicId) await remove(publicId);
    set({ [imageKey]: null, [publicIdKey]: null } as Partial<InvitationState>);
  };

  return (
    <EditorField>
      <EditorLabel htmlFor={imageKey}>{label}</EditorLabel>
      {image ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isUploading}
                aria-label={`Ubah ${label}`}
                className="relative h-24 w-24 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
              >
                <img
                  src={image}
                  alt={label}
                  className="h-24 w-24 rounded-full border object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                <Upload className="h-4 w-4" />
                Ganti foto
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleRemove}>
                <Trash2 className="h-4 w-4" />
                Hapus foto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <button
          id={imageKey}
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Unggah</span>
        </button>
      )}
      <input
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
        title={`Sesuaikan ${label}`}
      />
    </EditorField>
  );
}

export function CoupleSection() {
  return (
    <FieldGroup>
      <PhotoField
        label="Foto Mempelai Wanita"
        imageKey="brideImage"
        publicIdKey="brideImagePublicId"
      />
      <BrideNameField />
      <BrideNicknameField />
      <BrideDescField />
      <PhotoField
        label="Foto Mempelai Pria"
        imageKey="groomImage"
        publicIdKey="groomImagePublicId"
      />
      <GroomNameField />
      <GroomNicknameField />
      <GroomDescField />
    </FieldGroup>
  );
}
