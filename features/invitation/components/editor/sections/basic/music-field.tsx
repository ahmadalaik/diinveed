"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Music, Pause, Play, Upload, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useAudioPreview } from "@/features/invitation/hooks/use-audio-preview";
import { MUSIC_PRESETS } from "@/features/invitation/lib/music-presets";
import { EditorError, EditorField, EditorLabel } from "../../editor-field";

export function MusicField() {
  const music = useInvitationStore((s) => s.music);
  const musicKey = useInvitationStore((s) => s.musicKey);
  const errors = useInvitationStore((s) => s.publishErrors?.music);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();
  const preview = useAudioPreview();

  const MAX_SIZE_MB = 8;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const [sizeError, setSizeError] = useState<string | null>(null);

  const selectedPreset = MUSIC_PRESETS.find((p) => p.url === music);
  const selectedLabel = selectedPreset
    ? selectedPreset.title
    : music
      ? "Lagu terunggah"
      : "";

  const clearPreviousUpload = async () => {
    if (musicKey) await remove(musicKey);
  };

  const selectPreset = async (url: string) => {
    await clearPreviousUpload();
    set({ music: url, musicKey: "" });
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`File musik maksimal 5MB.`);
      e.target.value = "";
      return;
    }

    setSizeError(null);
    const { url, key } = await upload(file, { kind: "music", invitationId });
    await clearPreviousUpload();
    set({ music: url, musicKey: key });
    e.target.value = "";
  };

  const handleRemove = async () => {
    preview.stop();
    await clearPreviousUpload();
    set({ music: "", musicKey: "" });
  };

  const isUrlPlaying = (url: string) =>
    preview.isPlaying && preview.currentUrl === url;

  return (
    <EditorField>
      <EditorLabel htmlFor="basics-music">Musik Latar</EditorLabel>

      <Tabs defaultValue="library">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">Pustaka</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-2 space-y-1">
          {MUSIC_PRESETS.map((preset) => {
            const active = preset.url === music;
            const playing = isUrlPlaying(preset.url);
            return (
              <div
                key={preset.id}
                role="button"
                tabIndex={0}
                onClick={() => selectPreset(preset.url)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectPreset(preset.url);
                  }
                }}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-muted",
                  active && "bg-muted",
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  aria-label={
                    playing ? `Jeda ${preset.title}` : `Putar ${preset.title}`
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    preview.toggle(preset.url);
                  }}
                >
                  {playing ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </Button>
                <span className="flex-1 truncate">
                  {preset.title}
                  {preset.artist ? (
                    <span className="text-muted-foreground">
                      {" "}
                      — {preset.artist}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-3 w-3 shrink-0 rounded-full border",
                    active
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40",
                  )}
                />
              </div>
            );
          })}
        </TabsContent>

        <TabsContent
          value="upload"
          forceMount
          className="mt-2 data-[state=inactive]:hidden"
        >
          <Button
            variant="outline"
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="h-24 w-full flex-col gap-1 rounded-lg border-2 border-dashed shadow-none transition-colors hover:bg-muted/50 hover:cursor-pointer"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {isUploading
                ? `Mengunggah ${uploadProgress}%`
                : "Klik untuk mengunggah MP3"}
            </span>
          </Button>
          {sizeError && <EditorError errors={[sizeError]} />}
          <Input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFile}
          />
        </TabsContent>
      </Tabs>

      {music ? (
        <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/60 px-2 py-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            aria-label={isUrlPlaying(music) ? "Jeda" : "Putar"}
            onClick={() => preview.toggle(music)}
          >
            {isUrlPlaying(music) ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          <Music className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="flex-1 truncate text-[13px]">{selectedLabel}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            aria-label="Hapus musik"
            onClick={handleRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
      <EditorError errors={errors} />
    </EditorField>
  );
}
