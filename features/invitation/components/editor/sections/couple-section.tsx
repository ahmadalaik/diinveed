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
import { useR2Upload } from "@/hooks/use-r2-upload";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { ImageCropperDialog } from "../image-cropper-dialog";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

function SwitchNameOrderField() {
  const isBrideFirst = useInvitationStore((s) => s.isBrideFirst);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField className="flex-row">
      <EditorLabel htmlFor="is-bride-first">
        Nama Mempelai Wanita Dahulu
      </EditorLabel>
      <Switch
        id="is-bride-first"
        checked={isBrideFirst}
        onCheckedChange={() => set({ isBrideFirst: !isBrideFirst })}
      />
    </EditorField>
  );
}

function BrideNameField() {
  const brideName = useInvitationStore((s) => s.brideName);
  const errors = useInvitationStore((s) => s.publishErrors?.brideName);
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
      <EditorError errors={errors} />
    </EditorField>
  );
}

function BrideNicknameField() {
  const brideNickname = useInvitationStore((s) => s.brideNickname);
  const errors = useInvitationStore((s) => s.publishErrors?.brideNickname);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="brideNickname">
        Nama Panggilan Mempelai Wanita
      </EditorLabel>
      <EditorInput
        id="brideNickname"
        autoComplete="off"
        placeholder="Citra"
        value={brideNickname}
        onChange={(e) => set({ brideNickname: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

function BrideDescField() {
  const brideDesc = useInvitationStore((s) => s.brideDescription);
  const errors = useInvitationStore((s) => s.publishErrors?.brideDescription);
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
      <EditorError errors={errors} />
    </EditorField>
  );
}

function GroomNameField() {
  const groomName = useInvitationStore((s) => s.groomName);
  const errors = useInvitationStore((s) => s.publishErrors?.groomName);
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
      <EditorError errors={errors} />
    </EditorField>
  );
}

function GroomNicknameField() {
  const groomNickname = useInvitationStore((s) => s.groomNickname);
  const errors = useInvitationStore((s) => s.publishErrors?.groomNickname);
  const set = useInvitationStore((s) => s.set);
  return (
    <EditorField>
      <EditorLabel htmlFor="groomNickname">
        Nama Panggilan Mempelai Pria
      </EditorLabel>
      <EditorInput
        id="groomNickname"
        autoComplete="off"
        placeholder="Deni"
        value={groomNickname}
        onChange={(e) => set({ groomNickname: e.target.value })}
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}

function GroomDescField() {
  const groomDesc = useInvitationStore((s) => s.groomDescription);
  const errors = useInvitationStore((s) => s.publishErrors?.groomDescription);
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
      <EditorError errors={errors} />
    </EditorField>
  );
}

function PhotoField({
  label,
  imageKey,
  keyProp,
}: {
  label: string;
  imageKey: "brideImage" | "groomImage";
  keyProp: "brideImageKey" | "groomImageKey";
}) {
  const image = useInvitationStore((s) => s[imageKey]);
  const storedKey = useInvitationStore((s) => s[keyProp]);
  const errors = useInvitationStore((s) => s.publishErrors?.[imageKey]);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();

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
    const { url, key: newKey } = await upload(file, { kind: "couple", invitationId });
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
                className="relative h-24 w-24 rounded-full p-0  outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
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
        <Button
          id={imageKey}
          variant="outline"
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50 shadow-none"
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">Unggah</span>
        </Button>
      )}
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

export function CoupleSection() {
  const isBrideFirst = useInvitationStore((s) => s.isBrideFirst);

  if (!isBrideFirst) {
    return (
      <FieldGroup>
        <SwitchNameOrderField />
        <PhotoField
          label="Foto Mempelai Pria"
          imageKey="groomImage"
          keyProp="groomImageKey"
        />
        <GroomNameField />
        <GroomNicknameField />
        <GroomDescField />
        <PhotoField
          label="Foto Mempelai Wanita"
          imageKey="brideImage"
          keyProp="brideImageKey"
        />
        <BrideNameField />
        <BrideNicknameField />
        <BrideDescField />
      </FieldGroup>
    );
  }

  return (
    <FieldGroup>
      <SwitchNameOrderField />
      <PhotoField
        label="Foto Mempelai Wanita"
        imageKey="brideImage"
        keyProp="brideImageKey"
      />
      <BrideNameField />
      <BrideNicknameField />
      <BrideDescField />
      <PhotoField
        label="Foto Mempelai Pria"
        imageKey="groomImage"
        keyProp="groomImageKey"
      />
      <GroomNameField />
      <GroomNicknameField />
      <GroomDescField />
    </FieldGroup>
  );
}
