"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Gallery } from "@/features/invitation/types/invitation.type";

const LIGHTBOX_MIN_ZOOM = 50;
const LIGHTBOX_MAX_ZOOM = 200;
const LIGHTBOX_ZOOM_STEP = 25;
const LIGHTBOX_DEFAULT_ZOOM = 100;
const LIGHTBOX_CENTER = { x: 0, y: 0 };

interface Point {
  x: number;
  y: number;
}

interface DragStart extends Point {
  pointerId: number;
  pan: Point;
}

function getLoopedLightboxIndex(
  currentIndex: number,
  direction: number,
  total: number,
) {
  if (total <= 0) return 0;
  return (currentIndex + direction + total) % total;
}

function clampLightboxZoom(zoom: number) {
  return Math.min(Math.max(zoom, LIGHTBOX_MIN_ZOOM), LIGHTBOX_MAX_ZOOM);
}

function formatLightboxCounter(currentIndex: number, total: number) {
  return `${currentIndex + 1} / ${total}`;
}

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
  const [pan, setPan] = useState<Point>(LIGHTBOX_CENTER);
  const currentImage = images[activeIndex] ?? null;
  const totalImages = images.length;
  const counter = useMemo(
    () => formatLightboxCounter(activeIndex, totalImages),
    [activeIndex, totalImages],
  );

  const moveImage = useCallback(
    (direction: number) => {
      setZoom(LIGHTBOX_DEFAULT_ZOOM);
      setPan(LIGHTBOX_CENTER);
      setActiveIndex(
        getLoopedLightboxIndex(activeIndex, direction, totalImages),
      );
    },
    [activeIndex, setActiveIndex, totalImages],
  );

  const updateZoom = useCallback((nextZoom: number) => {
    const clampedZoom = clampLightboxZoom(nextZoom);

    setZoom(clampedZoom);
    if (clampedZoom <= LIGHTBOX_DEFAULT_ZOOM) {
      setPan(LIGHTBOX_CENTER);
    }
  }, []);

  const handleClose = useCallback(() => {
    setZoom(LIGHTBOX_DEFAULT_ZOOM);
    setPan(LIGHTBOX_CENTER);
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
        aria-describedby={undefined}
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
              pan={pan}
              onPanChange={setPan}
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
  pan,
  onPanChange,
}: {
  src: string;
  alt: string;
  zoom: number;
  pan: Point;
  onPanChange: (pan: Point) => void;
}) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [naturalSize, setNaturalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<DragStart | null>(null);
  const aspectRatio = naturalSize
    ? naturalSize.width / naturalSize.height
    : 3 / 4;

  const clampPan = useCallback(
    (nextPan: Point) => {
      const imageFrame = imageFrameRef.current;
      const viewport = imageFrame?.parentElement;

      if (!imageFrame || !viewport || zoom <= LIGHTBOX_DEFAULT_ZOOM) {
        return LIGHTBOX_CENTER;
      }

      const scale = zoom / LIGHTBOX_DEFAULT_ZOOM;
      const maxX = Math.max(
        0,
        (imageFrame.offsetWidth * scale - viewport.clientWidth) / 2,
      );
      const maxY = Math.max(
        0,
        (imageFrame.offsetHeight * scale - viewport.clientHeight) / 2,
      );

      return {
        x: Math.min(Math.max(nextPan.x, -maxX), maxX),
        y: Math.min(Math.max(nextPan.y, -maxY), maxY),
      };
    },
    [zoom],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      zoom <= LIGHTBOX_DEFAULT_ZOOM ||
      event.button !== 0 ||
      event.isPrimary === false
    ) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      pan: clampPan(pan),
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;

    if (!dragStart || dragStart.pointerId !== event.pointerId) return;

    event.preventDefault();
    onPanChange(
      clampPan({
        x: dragStart.pan.x + event.clientX - dragStart.x,
        y: dragStart.pan.y + event.clientY - dragStart.y,
      }),
    );
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartRef.current = null;
    setIsDragging(false);
  };

  return (
    <div
      ref={imageFrameRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      className={cn(
        "pointer-events-auto relative max-h-full max-w-full overflow-hidden rounded-xl shadow-2xl ease-out",
        aspectRatio >= 1 ? "w-full" : "h-full",
        zoom > LIGHTBOX_DEFAULT_ZOOM && "touch-none select-none cursor-grab",
        isDragging
          ? "cursor-grabbing transition-none"
          : "transition-transform duration-300",
      )}
      style={{
        aspectRatio,
        transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom / LIGHTBOX_DEFAULT_ZOOM})`,
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        draggable={false}
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
        draggable={false}
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
  );
}
