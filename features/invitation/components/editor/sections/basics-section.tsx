/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ChangeEvent, useRef } from "react";
import { FieldGroup } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { TIMEZONES } from "@/components/ui/time-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";

function CoverImageField() {
  const coverImage = useInvitationStore((s) => s.coverImage);
  const coverImagePublicId = useInvitationStore((s) => s.coverImagePublicId);
  const set = useInvitationStore((s) => s.set);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useCloudinaryUpload();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { url, publicId: newId } = await upload(file);
    if (coverImagePublicId) await remove(coverImagePublicId);
    set({ coverImage: url, coverImagePublicId: newId });
  };

  const handleRemove = async () => {
    if (coverImagePublicId) await remove(coverImagePublicId);
    set({ coverImage: null, coverImagePublicId: null });
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
    </EditorField>
  );
}

function DateField() {
  const date = useInvitationStore((s) => s.date);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField className="min-w-0">
      <EditorLabel htmlFor="basics-date">Date</EditorLabel>
      <DatePicker
        id="basics-date"
        value={date}
        onChange={(value) => set({ date: value })}
        yearsBack={1}
        yearsForward={5}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
    </EditorField>
  );
}

function TimeField() {
  const time = useInvitationStore((s) => s.time);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField className="min-w-0">
      <EditorLabel htmlFor="basics-time">Time</EditorLabel>
      <TimePicker
        id="basics-time"
        value={time}
        onChange={(value) => set({ time: value })}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
    </EditorField>
  );
}

function TimezoneField() {
  const timezone = useInvitationStore((s) => s.timezone);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-timezone">Timezone</EditorLabel>
      <Select
        value={timezone || undefined}
        onValueChange={(value) => set({ timezone: value })}
      >
        <SelectTrigger
          id="basics-timezone"
          className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
        >
          <SelectValue placeholder="Zona waktu" />
        </SelectTrigger>
        <SelectContent>
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </EditorField>
  );
}

function MessageField() {
  const message = useInvitationStore((s) => s.message);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-message">Message</EditorLabel>
      <EditorTextarea
        id="basics-message"
        rows={3}
        value={message}
        onChange={(e) => set({ message: e.target.value })}
        placeholder="A note for your guests…"
      />
    </EditorField>
  );
}

function CoupleField() {
  const title = useInvitationStore((s) => s.title);
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
    </EditorField>
  );
}

function TaglineField() {
  const subtitle = useInvitationStore((s) => s.subtitle);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-tagline">Tagline</EditorLabel>
      <EditorInput
        id="basics-tagline"
        value={subtitle}
        onChange={(e) => set({ subtitle: e.target.value })}
        placeholder="are getting married"
      />
    </EditorField>
  );
}

function HostsField() {
  const hosts = useInvitationStore((s) => s.hosts);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-hosts">Hosts</EditorLabel>
      <EditorInput
        id="basics-hosts"
        value={hosts}
        onChange={(e) => set({ hosts: e.target.value })}
        placeholder="Together with their families"
      />
    </EditorField>
  );
}

export function BasicsSection() {
  return (
    <FieldGroup className="gap-3">
      <CoverImageField />
      <CoupleField />
      <TaglineField />
      <FieldGroup className="grid grid-cols-2 gap-2">
        <DateField />
        <TimeField />
      </FieldGroup>
      <TimezoneField />
      <HostsField />
      <MessageField />
    </FieldGroup>
  );
};
