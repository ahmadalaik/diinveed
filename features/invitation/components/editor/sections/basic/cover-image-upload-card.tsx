"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { cn } from "@/lib/utils";
import { EditorError } from "../../editor-field";

const MAX_SIZE_MB = 12;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export type CoverUploadVariant = "desktop" | "mobile";

type CoverImageUploadCardProps = {
  id: string;
  title: string;
  variant: CoverUploadVariant;
  ratio: string;
  recommendedSize: string;
  image: string | null;
  imageKey: string | null;
  errors?: string[];
  icon: LucideIcon;
  onValueChange: (url: string | null, key: string | null) => void;
};

export function CoverImageUploadCard({
  id,
  title,
  variant,
  ratio,
  recommendedSize,
  image,
  imageKey,
  errors,
  icon: Icon,
  onValueChange,
}: CoverImageUploadCardProps) {
  const invitationId = useInvitationStore((s) => s.id);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, remove, isUploading, uploadProgress } = useR2Upload();
  const [sizeError, setSizeError] = useState<string | null>(null);
  const normalizedTitle = title.toLowerCase();
  const contextLabel =
    variant === "desktop" ? "Panel kiri 70%" : "Layar penuh mobile";

  const openFilePicker = () => fileRef.current?.click();

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Ukuran gambar maksimal ${MAX_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    setSizeError(null);
    const { url, key } = await upload(file, {
      kind: "cover",
      invitationId,
    });

    if (imageKey) {
      await remove(imageKey);
    }

    onValueChange(url, key);
    event.target.value = "";
  };

  const handleRemove = async () => {
    if (imageKey) {
      await remove(imageKey);
    }

    onValueChange(null, null);
  };

  const renderUploadSurface = (compact = false) => (
    <div
      className={cn(
        "relative size-full overflow-hidden bg-muted/20",
        variant === "mobile" ? "rounded-[18px]" : "rounded-l-md",
      )}
    >
      {image ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={isUploading}
              className="relative size-full overflow-hidden rounded-[inherit] p-0 hover:bg-transparent"
              aria-label={`Kelola cover ${normalizedTitle}`}
            >
              <Image
                src={image}
                alt={`Cover ${title}`}
                fill
                sizes={
                  variant === "desktop"
                    ? "(min-width: 768px) 70vw, 100vw"
                    : "144px"
                }
                className="rounded-[inherit] object-cover"
              />
              <span className="absolute right-2 bottom-2 flex size-7 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-xs backdrop-blur-sm">
                <Upload className="size-3.5" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={openFilePicker}
            >
              <Upload className="size-4" />
              Ganti cover
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="hover:cursor-pointer"
              onClick={handleRemove}
            >
              <Trash2 className="size-4" />
              Hapus cover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading}
          className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[inherit] bg-background/40 px-3 text-center transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Unggah cover ${normalizedTitle}`}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-background shadow-xs ring-1 ring-border">
            <ImagePlus className="size-4 text-muted-foreground" />
          </span>
          <span className="text-xs font-medium leading-tight text-foreground">
            Unggah {normalizedTitle}
          </span>
          {!compact && (
            <span className="text-[10.5px] leading-snug text-muted-foreground">
              JPG, PNG, atau WebP
            </span>
          )}
        </button>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/85 px-2 backdrop-blur-sm">
          <div className="w-full max-w-24">
            <Progress
              value={uploadProgress}
              aria-label={`Progress upload cover ${normalizedTitle}`}
            />
          </div>
          <span
            className="whitespace-nowrap text-[10.5px] font-medium leading-none text-primary"
            aria-label={`Mengunggah ${uploadProgress}%`}
          >
            {uploadProgress}%
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Card size="sm" className="gap-3 rounded-lg py-3 shadow-none">
      <CardHeader className="grid-cols-[1fr_auto] items-start gap-2 px-3">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-[13px]">
            <Icon className="size-3.5 text-muted-foreground" />
            <span>{title}</span>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] leading-snug text-muted-foreground">
            <span>{contextLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{recommendedSize}</span>
            <span aria-hidden="true">·</span>
            <span>Maks {MAX_SIZE_MB}MB</span>
          </div>
        </div>
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {ratio}
        </Badge>
      </CardHeader>

      <CardContent
        className={cn(
          "flex flex-col gap-3 px-3",
          variant === "mobile" &&
            "min-[420px]:grid min-[420px]:grid-cols-[9rem_minmax(0,1fr)] min-[420px]:items-center",
        )}
      >
        {variant === "desktop" ? (
          <div className="overflow-hidden rounded-md bg-muted/40 p-1.5 ring-1 ring-border">
            <div className="flex aspect-video overflow-hidden rounded-md bg-background shadow-xs">
              <div className="relative w-[70%] shrink-0">
                {renderUploadSurface()}
              </div>
              <div className="flex flex-1 flex-col justify-between border-l bg-background p-2">
                <div className="flex flex-col gap-1.5">
                  <div className="h-2 w-3/4 rounded-full bg-muted" />
                  <div className="h-2 w-1/2 rounded-full bg-muted" />
                </div>
                <div className="grid gap-1.5">
                  <div className="h-1.5 rounded-full bg-muted/80" />
                  <div className="h-1.5 w-4/5 rounded-full bg-muted/80" />
                  <div className="h-1.5 w-2/3 rounded-full bg-muted/80" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto aspect-9/16 w-full max-w-36 rounded-[22px] border-2 border-foreground/10 bg-background p-0.5 shadow-xs ring-1 ring-border">
              {renderUploadSurface(true)}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Gunakan cover vertikal untuk tampilan undangan di ponsel.
            </p>
          </>
        )}

        {sizeError && <EditorError errors={[sizeError]} />}
        <Input
          id={id}
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <EditorError errors={errors} />
      </CardContent>
    </Card>
  );
}
