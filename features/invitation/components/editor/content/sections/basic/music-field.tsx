"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Music,
  Pause,
  Play,
  Upload,
  Trash2,
  AudioLines,
  Check,
  SquarePen,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useAudioPreview } from "@/features/invitation/hooks/use-audio-preview";
import { MUSIC_PRESETS } from "@/features/invitation/lib/music-presets";
import { EditorError, EditorField, EditorLabel } from "../../../editor-field";
import { publicUrl } from "@/lib/storage/url";

export function MusicField() {
  const music = useInvitationStore((s) => s.music);
  const musicKey = useInvitationStore((s) => s.musicKey);
  const musicFileName = useInvitationStore((s) => s.musicFileName);
  const errors = useInvitationStore((s) => s.publishErrors?.music);
  const set = useInvitationStore((s) => s.set);
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();
  const preview = useAudioPreview(music);

  const MAX_SIZE_MB = 8;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      preview.stop();
    }
  }, [open, preview]);

  const uploadedMusicUrl = musicKey ? publicUrl(musicKey) : null;

  const getUploadedLabel = () => {
    if (musicFileName) return musicFileName.split(".")[0];
    if (musicKey) {
      const parts = musicKey.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.includes(".")) return lastPart;
    }
    return "Lagu terunggah";
  };

  const selectedPreset = MUSIC_PRESETS.find((p) => p.url === music);
  const selectedLabel = selectedPreset
    ? selectedPreset.title
    : music && music === uploadedMusicUrl
      ? getUploadedLabel()
      : "";

  const clearPreviousUpload = async () => {
    if (musicKey) {
      await remove(musicKey);
    }
  };

  const selectPreset = async (url: string) => {
    set({ music: url });
    setOpen(false);
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
    const fileName = file.name;
    const { url, key } = await upload(file, {
      kind: "music",
      invitationId,
      preserveFileName: true,
    });

    await clearPreviousUpload();
    set({ music: url, musicKey: key, musicFileName: fileName });

    e.target.value = "";
    setOpen(false);
  };

  const handleRemove = () => {
    preview.stop();
    set({ music: "" });
  };

  const handleDeleteUploadedMusic = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    if (uploadedMusicUrl && preview.currentUrl === uploadedMusicUrl) {
      preview.stop();
    }
    await clearPreviousUpload();
    set({
      musicKey: "",
      musicFileName: null,
      ...(music === uploadedMusicUrl ? { music: "" } : {}),
    });
  };

  const isUrlPlaying = (url: string) =>
    preview.isPlaying && preview.currentUrl === url;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <EditorField publishField="music" invalid={Boolean(errors?.length)}>
      <div className="flex items-center justify-between">
        <EditorLabel htmlFor="basics-music" className="mb-0">
          Musik Latar
        </EditorLabel>

        {music && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-destructive hover:bg-transparent hover:text-destructive/80 hover:underline"
            onClick={handleRemove}
          >
            Reset
          </Button>
        )}
      </div>

      {!music && (
        <Button
          variant="outline"
          aria-invalid={Boolean(errors?.length)}
          onClick={() => setOpen(true)}
          className="mt-2 w-full justify-between font-normal text-muted-foreground hover:text-foreground"
        >
          <span>Pilih musik latar...</span>
          <Music className="h-4 w-4 opacity-50" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden flex flex-col max-h-[85vh]">
          <DialogHeader className="px-4 mt-4 h-8 justify-center pb-0">
            <DialogTitle>Pilih Musik Latar</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col flex-1 overflow-hidden px-4 pb-4">
            <Tabs
              defaultValue="library"
              className="flex flex-col flex-1 overflow-hidden"
            >
              <TabsList className="grid w-full grid-cols-2 shrink-0">
                <TabsTrigger value="library">Pustaka</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
              </TabsList>

              <TabsContent
                value="library"
                className="flex-1 overflow-y-auto mt-4 space-y-1 pr-2 outline-none"
              >
                {MUSIC_PRESETS.map((preset) => {
                  const active = preset.url === music;
                  const playing = isUrlPlaying(preset.url);
                  return (
                    <div
                      key={preset.id}
                      className={cn(
                        "group flex flex-col gap-1 rounded-lg border border-transparent px-2 py-2 text-[13px] transition-all hover:bg-muted/50",
                        active &&
                          "border-primary/10 bg-primary/5 hover:bg-primary/10",
                      )}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => selectPreset(preset.url)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectPreset(preset.url);
                          }
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 shrink-0 rounded-full transition-all",
                            playing
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 shadow-sm"
                              : "bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground group-hover:shadow-sm",
                          )}
                          aria-label={
                            playing
                              ? `Jeda ${preset.title}`
                              : `Putar ${preset.title}`
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            preview.toggle(preset.url);
                          }}
                        >
                          {playing ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                        <div className="flex flex-1 items-center gap-2 truncate">
                          <span
                            className={cn(
                              "truncate font-medium",
                              active ? "text-primary" : "text-foreground",
                            )}
                          >
                            {preset.title}
                          </span>
                          {preset.artist ? (
                            <span className="text-muted-foreground truncate">
                              — {preset.artist}
                            </span>
                          ) : null}
                          {playing && (
                            <AudioLines className="h-3.5 w-3.5 shrink-0 animate-pulse text-primary" />
                          )}
                        </div>
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                          {active ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border border-muted-foreground/30 group-hover:border-muted-foreground/50 transition-colors" />
                          )}
                        </div>
                      </div>

                      {playing && preview.duration > 0 && (
                        <div className="flex items-center gap-3 pl-[44px] pr-2 pt-0.5 pb-1 w-full animate-in slide-in-from-top-2 fade-in duration-200">
                          <span className="w-7 text-right text-[10px] font-medium text-muted-foreground tabular-nums">
                            {formatTime(preview.currentTime)}
                          </span>
                          <Slider
                            value={[preview.currentTime]}
                            max={preview.duration}
                            step={1}
                            onValueChange={(val) => preview.seek(val[0])}
                            className="flex-1 cursor-pointer"
                          />
                          <span className="w-7 text-[10px] font-medium text-muted-foreground tabular-nums">
                            {formatTime(preview.duration)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent
                value="upload"
                forceMount
                className="mt-4 data-[state=inactive]:hidden flex-1 shrink-0 flex flex-col gap-4"
              >
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                  className="group relative flex h-32 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/20 hover:bg-muted/50 hover:border-primary/50 transition-all hover:cursor-pointer shadow-none shrink-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-sm group-hover:scale-105 transition-transform">
                    <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {isUploading
                        ? `Mengunggah ${uploadProgress}%`
                        : "Klik untuk pilih MP3"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Maksimal ukuran file 5MB
                    </span>
                  </div>
                </Button>
                {sizeError && (
                  <EditorError errors={[sizeError]} className="mt-0" />
                )}

                {uploadedMusicUrl && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Lagu yang diunggah:
                    </span>
                    <div
                      className={cn(
                        "group flex flex-col gap-1 rounded-lg border px-2 py-2 text-[13px] transition-all",
                        music === uploadedMusicUrl
                          ? "border-primary/20 bg-primary/5"
                          : "border-transparent hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8 shrink-0 rounded-full transition-all",
                            isUrlPlaying(uploadedMusicUrl)
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80",
                          )}
                          aria-label={
                            isUrlPlaying(uploadedMusicUrl) ? "Jeda" : "Putar"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            preview.toggle(uploadedMusicUrl);
                          }}
                        >
                          {isUrlPlaying(uploadedMusicUrl) ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>

                        <div
                          className="flex flex-1 items-center gap-2 truncate cursor-pointer"
                          onClick={() => {
                            set({ music: uploadedMusicUrl });
                            setOpen(false);
                          }}
                        >
                          <span
                            className={cn(
                              "truncate font-medium",
                              music === uploadedMusicUrl
                                ? "text-primary"
                                : "text-foreground",
                            )}
                          >
                            {getUploadedLabel()}
                          </span>
                          {isUrlPlaying(uploadedMusicUrl) && (
                            <AudioLines className="h-3.5 w-3.5 shrink-0 animate-pulse text-primary" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {music === uploadedMusicUrl && (
                            <div className="flex h-6 w-6 items-center justify-center">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            onClick={handleDeleteUploadedMusic}
                            aria-label="Hapus lagu yang diunggah"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {isUrlPlaying(uploadedMusicUrl) &&
                        preview.duration > 0 && (
                          <div className="flex items-center gap-3 pl-[44px] pr-2 pt-0.5 pb-1 w-full animate-in slide-in-from-top-2 fade-in duration-200">
                            <span className="w-7 text-right text-[10px] font-medium text-muted-foreground tabular-nums">
                              {formatTime(preview.currentTime)}
                            </span>
                            <Slider
                              value={[preview.currentTime]}
                              max={preview.duration}
                              step={1}
                              onValueChange={(val) => preview.seek(val[0])}
                              className="flex-1 cursor-pointer"
                            />
                            <span className="w-7 text-[10px] font-medium text-muted-foreground tabular-nums">
                              {formatTime(preview.duration)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                <Input
                  ref={fileRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {music ? (
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Music className="size-4" />
            </div>

            <div className="flex flex-1 flex-col justify-center overflow-hidden pt-0.5">
              <span className="truncate text-[13px] font-medium text-foreground">
                {selectedLabel}
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              aria-label="Hapus musik"
              onClick={() => setOpen(true)}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
      <EditorError errors={errors} />
    </EditorField>
  );
}
