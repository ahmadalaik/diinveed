"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

const COVER_FALLBACK =
  "https://images.pexels.com/photos/36190389/pexels-photo-36190389.jpeg";
const MIN_DISPLAY_MS = 3000;
const MAX_DISPLAY_MS = 8000;
const FADE_MS = 600;

interface Props {
  inv: InvitationState;
  onDone: () => void;
  /** Injectable for tests; defaults to preloading the cover image + web fonts. */
  preload?: () => Promise<void>;
}

function preloadAssets(coverSrc: string): Promise<void> {
  const image: Promise<void> = new Promise((resolve) => {
    const el = new Image();
    el.onload = () => resolve();
    el.onerror = () => resolve();
    el.src = coverSrc;
    if (el.complete) resolve();
  });
  const fonts =
    typeof document !== "undefined" && "fonts" in document
      ? document.fonts.ready.then(() => undefined)
      : Promise.resolve();
  return Promise.all([image, fonts]).then(() => undefined);
}

export function LoadingKelana({ inv, onDone, preload }: Props) {
  const [fading, setFading] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    const load =
      preload ?? (() => preloadAssets(inv.coverImage ?? COVER_FALLBACK));

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFading(true);
      window.setTimeout(onDone, FADE_MS);
    };

    let minTimer: number | undefined;
    load().then(() => {
      const elapsed = Date.now() - startedAt;
      minTimer = window.setTimeout(
        finish,
        Math.max(0, MIN_DISPLAY_MS - elapsed),
      );
    });
    const maxTimer = window.setTimeout(finish, MAX_DISPLAY_MS);

    return () => {
      window.clearTimeout(maxTimer);
      if (minTimer) window.clearTimeout(minTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const name = inv.isBrideFirst
    ? `${inv.brideNickname} & ${inv.groomNickname}`
    : `${inv.groomNickname} & ${inv.brideNickname}`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!fading}
      className={cn(
        "fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-stone-900 transition-opacity duration-[600ms] ease-in-out",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <p className="text-xs tracking-[0.2em] uppercase text-(--tpl-secondary)">
        The Wedding of
      </p>
      <h1 className="text-4xl text-stone-50 font-(family-name:--tpl-font-display) drop-shadow-lg">
        {name}
      </h1>
      <span
        className="size-2 rounded-full bg-(--tpl-secondary) animate-pulse"
        aria-hidden
      />
      <span className="sr-only">Memuat undangan…</span>
    </div>
  );
}
