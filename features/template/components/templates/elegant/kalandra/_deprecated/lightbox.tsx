"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Gallery } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import {
  LIGHTBOX_DEFAULT_ZOOM,
  LIGHTBOX_ZOOM_STEP,
  clampLightboxZoom,
  formatLightboxCounter,
  getLoopedLightboxIndex,
} from "./lightbox-utils";

interface Props {
  lightboxOpen: boolean;
  closeLightbox: () => void;
  images: Gallery[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function Lightbox({
  lightboxOpen,
  closeLightbox,
  images,
  activeIndex,
  setActiveIndex,
}: Props) {
  const [zoom, setZoom] = useState(LIGHTBOX_DEFAULT_ZOOM);
  const currentImage = images[activeIndex] ?? null;
  const totalImages = images.length;
  const counter = useMemo(
    () => formatLightboxCounter(activeIndex, totalImages),
    [activeIndex, totalImages],
  );

  const moveImage = useCallback(
    (direction: number) => {
      setZoom(LIGHTBOX_DEFAULT_ZOOM);
      setActiveIndex(
        getLoopedLightboxIndex(activeIndex, direction, totalImages),
      );
    },
    [activeIndex, setActiveIndex, totalImages],
  );

  const updateZoom = useCallback((nextZoom: number) => {
    setZoom(clampLightboxZoom(nextZoom));
  }, []);

  const handleClose = useCallback(() => {
    setZoom(LIGHTBOX_DEFAULT_ZOOM);
    closeLightbox();
  }, [closeLightbox]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") moveImage(-1);
      if (event.key === "ArrowRight") moveImage(1);
      if (event.key === "+" || event.key === "=") {
        updateZoom(zoom + LIGHTBOX_ZOOM_STEP);
      }
      if (event.key === "-") updateZoom(zoom - LIGHTBOX_ZOOM_STEP);
      if (event.key === "0") updateZoom(LIGHTBOX_DEFAULT_ZOOM);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, moveImage, updateZoom, zoom]);

  if (!currentImage) return null;

  return (
    <Dialog
      open={lightboxOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          "inset-0 top-0 left-0 flex h-dvh max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-0 bg-black/95 p-0 text-white ring-0 sm:max-w-none",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
        )}
      >
        <DialogTitle className="sr-only">Gallery image preview</DialogTitle>

        <button
          type="button"
          aria-label="Close gallery preview backdrop"
          onClick={handleClose}
          className="absolute inset-0 z-0 cursor-default bg-transparent"
        />

        <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-4">
          <div className="rounded-full bg-white/10 px-4 py-2 text-base font-semibold tracking-wide text-white backdrop-blur-md">
            {counter}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Close gallery preview"
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 size-12 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
        >
          <X />
        </Button>

        <div className="pointer-events-none z-10 flex min-h-0 flex-1 items-center justify-center px-3 py-20 sm:py-24">
          <div className="relative flex h-[calc(100dvh-10rem)] max-h-[78dvh] w-full max-w-[min(96vw,1200px)] items-center justify-center overflow-hidden">
            <LightboxImage
              key={currentImage.url}
              src={currentImage.url}
              alt={`Gallery image ${activeIndex + 1}`}
              zoom={zoom}
            />
          </div>
        </div>

        {totalImages > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Previous gallery image"
              onClick={() => moveImage(-1)}
              className="absolute left-4 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border-none bg-white/20 text-white backdrop-blur-md hover:bg-white/30 hover:text-white sm:left-6 sm:size-12"
            >
              <ChevronLeft />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Next gallery image"
              onClick={() => moveImage(1)}
              className="absolute right-4 top-1/2 z-20 size-11 -translate-y-1/2 rounded-full border-none bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:text-white sm:right-6 sm:size-12"
            >
              <ChevronRight />
            </Button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
          <div className="flex h-12 items-center gap-3 rounded-full bg-white/10 px-5 text-white backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Zoom out"
              onClick={() => updateZoom(zoom - LIGHTBOX_ZOOM_STEP)}
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <Minus />
            </Button>

            <span className="w-16 text-center text-base font-semibold tabular-nums">
              {zoom}%
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Zoom in"
              onClick={() => updateZoom(zoom + LIGHTBOX_ZOOM_STEP)}
              className="rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <Plus />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Reset zoom"
              onClick={() => updateZoom(LIGHTBOX_DEFAULT_ZOOM)}
              className="rounded-full text-white/80 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LightboxImage({
  src,
  alt,
  zoom,
}: {
  src: string;
  alt: string;
  zoom: number;
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const aspectRatio = naturalSize
    ? naturalSize.width / naturalSize.height
    : 3 / 4;

  return (
    <>
      <div
        className={cn(
          "pointer-events-auto relative max-h-full max-w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ease-out",
          aspectRatio >= 1 ? "w-full" : "h-full",
          isImageLoading ? "scale-95" : "scale-100",
        )}
        style={{
          aspectRatio,
          transform: `scale(${zoom / 100})`,
        }}
      >
        <Image
          src={src}
          alt="Loading gallery preview"
          fill
          sizes="100vw"
          className={cn(
            "rounded-xl object-cover blur-2xl transition-opacity duration-500",
            isImageLoading ? "opacity-40" : "opacity-0",
          )}
        />

        <Image
          src={src}
          alt={alt}
          fill
          quality={100}
          loading="eager"
          sizes="100vw"
          onLoad={(event) => {
            setNaturalSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            });
            setIsImageLoading(false);
          }}
          className={cn(
            "rounded-xl object-cover transition-opacity duration-300 ease-out",
            isImageLoading ? "opacity-0" : "opacity-100",
          )}
        />
      </div>
    </>
  );
}
