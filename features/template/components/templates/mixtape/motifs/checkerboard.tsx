"use client";

import { useId } from "react";

type CheckerboardProps = { className?: string };

/**
 * Motif utama: batang vertikal ditimpa dua pita bergelombang dengan
 * `mix-blend-mode: difference`. Di luar pita, batang tetap utuh; di dalam
 * pita, batang berubah jadi kotak-kotak. Efeknya "bendera berkibar",
 * bukan riak konsentris.
 *
 * `useId` wajib: satu halaman memuat beberapa Checkerboard sekaligus, dan
 * id `<pattern>` yang kembar membuat semuanya memakai pattern pertama.
 */
export function Checkerboard({ className }: CheckerboardProps) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute ${className ?? ""}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="25"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect width="12.5" height="120" fill="var(--tpl-bg-primary)" />
        </pattern>
      </defs>
      <rect width="200" height="120" fill="var(--tpl-bg-secondary)" />
      <rect width="200" height="120" fill={`url(#${patternId})`} />
      <g style={{ mixBlendMode: "difference" }} className="mixtape-wave-band">
        <path
          d="M0 26C46 4 88 50 136 30 174 14 200 34 200 34l0 30S174 44 136 60 46 34 0 56Z"
          fill="var(--tpl-bg-primary)"
        />
        <path
          d="M0 82C46 60 88 106 136 86c38-16 64 4 64 4l0 34-200 0Z"
          fill="var(--tpl-bg-primary)"
        />
      </g>
    </svg>
  );
}
