"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type OurifyWaveMarkProps = {
  className?: string;
  label?: string;
};

export function OurifyWaveMark({ className, label }: OurifyWaveMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8", className)}
      data-mark="three-wave"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      <path
        d="M14.5 24.7c11.5-3.5 24.5-2.5 35 2.8"
        fill="none"
        stroke="#121212"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M16.8 34.1c9.6-2.8 20.5-2 29.3 2.3"
        fill="none"
        stroke="#121212"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M19.3 42.7c7.4-2 15.5-1.4 22.4 1.7"
        fill="none"
        stroke="#121212"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

type OurifyArtworkProps = {
  src: string | null | undefined;
  alt: string;
  fallbackLabel: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
};

export function OurifyArtwork({
  src,
  alt,
  fallbackLabel,
  sizes,
  preload = false,
  className,
  imageClassName,
}: OurifyArtworkProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = Boolean(src && failedSource === src);

  return (
    <div
      className={cn(
        "relative isolate aspect-square overflow-hidden bg-(--tpl-bg-tertiary)",
        className,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={preload ? "eager" : "lazy"}
          onError={() => setFailedSource(src)}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div
          role="img"
          aria-label={fallbackLabel}
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,color-mix(in_srgb,var(--tpl-text-tertiary)_75%,transparent),transparent_34%),linear-gradient(145deg,var(--tpl-bg-tertiary),var(--tpl-bg-primary)_72%)]"
        >
          <div className="absolute inset-0 opacity-30 [background-image:repeating-radial-gradient(circle_at_70%_75%,transparent_0,transparent_10px,color-mix(in_srgb,var(--tpl-text-primary)_12%,transparent)_11px,color-mix(in_srgb,var(--tpl-text-primary)_12%,transparent)_12px)]" />
          <OurifyWaveMark className="relative size-20 text-(--tpl-text-tertiary) drop-shadow-2xl" />
        </div>
      )}
    </div>
  );
}
