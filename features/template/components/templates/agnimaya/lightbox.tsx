"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  lightboxOpen: boolean;
  closeLightbox: () => void;
  lightboxImg: string | null;
  mode: "preview" | "guest";
}

export function Lightbox({
  lightboxOpen,
  closeLightbox,
  lightboxImg,
  mode,
}: Props) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [prevImg, setPrevImg] = useState(lightboxImg);

  if (lightboxImg !== prevImg) {
    setPrevImg(lightboxImg);
    setIsImageLoading(true);
  }

  const isPreview = mode === "preview";

  useEffect(() => {
    if (isPreview) return;

    if (lightboxOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [lightboxOpen, isPreview]);

  return (
    <div
      id="lightbox"
      className={cn(
        "fixed inset-0 z-200 bg-black/95 flex items-center justify-center p-4 transition-all duration-300 ease-in-out",
        lightboxOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none",
      )}
      onClick={closeLightbox}
    >
      <button
        onClick={closeLightbox}
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
      >
        <CircleX strokeWidth={1.5} className="w-8 h-8" />
      </button>

      {lightboxOpen && lightboxImg && (
        <div className="relative flex items-center justify-center w-full h-full max-h-[85vh] max-w-full pointer-events-none">
          <Image
            src={lightboxImg}
            alt="Loading..."
            width={50}
            height={50}
            className={cn(
              "absolute inset-0 w-full h-full object-contain blur-2xl scale-110 transition-opacity duration-500 pointer-events-none",
              isImageLoading ? "opacity-50" : "opacity-0",
            )}
          />

          <Image
            fill
            src={lightboxImg}
            alt="Gallery Fullscreen"
            sizes="(max-width: 768px) 95vw, 70vw"
            loading="eager"
            onLoad={() => setIsImageLoading(false)}
            className={cn(
              "z-0 max-h-fit max-w-fit overflow-hidden m-auto object-contain shadow-2xl rounded-lg transition-all duration-500 ease-out pointer-events-auto",
              isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
            )}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <p className="absolute bottom-6 text-white/40 text-[10px] tracking-[0.2em] uppercase font-light">
        Tap outside to close
      </p>
    </div>
  );
}
