"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxProps {
  lightboxOpen: boolean;
  closeLightbox: () => void;
  lightboxImg: string | null;
  mode: "preview" | "guest";
}

export default function Lightbox({
  lightboxOpen,
  closeLightbox,
  lightboxImg,
  mode
}: LightboxProps) {
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
        "fixed inset-0 z-200 bg-black/95 flex items-center justify-center p-4 transition-all duration-300",
        lightboxOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none",
      )}
      onClick={closeLightbox}
    >
      <button
        onClick={closeLightbox}
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <CircleX strokeWidth={1.5} className="w-8 h-8" />
      </button>

      {lightboxImg && (
        <Image
          src={lightboxImg}
          alt="Gallery Fullscreen"
          width={1200}
          height={800}
          onLoad={() => setIsImageLoading(false)}
          className={cn(
            "max-h-[85vh] max-w-full w-auto h-auto object-contain shadow-2xl rounded-xl transition-all duration-500 ease-out",
            isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
          )}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <p className="absolute bottom-6 text-white/50 text-xs tracking-widest uppercase">
        Tap outside to close
      </p>
    </div>
  );
}
