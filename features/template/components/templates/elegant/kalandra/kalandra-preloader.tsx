"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

const COVER_FALLBACK = "";
const MIN_DISPLAY_MS = 5000;
const MAX_DISPLAY_MS = 8000;
const FADE_MS = 600;

interface Props {
  inv: InvitationState;
  onDone: () => void;
  /** Injectable for tests; defaults to preloading the cover image + web fonts. */
  preload?: () => Promise<void>;
}

async function preloadAssets(coverSrc: string): Promise<void> {
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

export function KalandraPreloader({ inv, onDone, preload }: Props) {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    const load =
      preload ?? (() => preloadAssets(inv.coverDesktopImage ?? COVER_FALLBACK));

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
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

    const progressInterval = window.setInterval(() => {
      if (doneRef.current) return;
      const elapsed = Date.now() - startedAt;
      const calculated = Math.min(
        99,
        Math.floor((elapsed / MIN_DISPLAY_MS) * 100),
      );
      setProgress(calculated);
    }, 50);

    return () => {
      window.clearTimeout(maxTimer);
      if (minTimer) window.clearTimeout(minTimer);
      window.clearInterval(progressInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!fading}
      className={cn(
        "fixed inset-0 z-60 flex flex-col items-center justify-center gap-6 bg-(--tpl-bg-primary) transition-opacity duration-600 ease-in-out",
        fading ? "opacity-0" : "opacity-100",
      )}
    >
      <p className="text-xs tracking-[0.2em] uppercase text-(--tpl-text-secondary)">
        The Wedding of
      </p>
      <h1 className="text-5xl text-(--tpl-text-secondary) font-(family-name:--tpl-font-heading) drop-shadow-sm text-center px-4">
        {inv.isBrideFirst ? inv.brideNickname : inv.groomNickname}{" "}
        <span className="text-3xl opacity-80 mx-2">&amp;</span>{" "}
        {inv.isBrideFirst ? inv.groomNickname : inv.brideNickname}
      </h1>

      <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-xs px-8">
        <p className="text-[10px] tracking-widest text-(--tpl-text-tertiary)/50 font-(family-name:--tpl-font-body)">
          {progress}%
        </p>
        <div className="w-32 h-px bg-(--tpl-text-primary)/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-(--tpl-text-secondary)/80 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-1.5 opacity-90">
        <span className="text-[8px] uppercase tracking-[0.3em] text-(--tpl-text-secondary)/50 font-(family-name:--tpl-font-body)">
          Powered by
        </span>
        <span className="text-xs tracking-widest text-(--tpl-text-tertiary)/80 font-(family-name:--tpl-font-heading)">
          Diinveed
        </span>
      </div>

      <span className="sr-only">Memuat undangan… {progress}%</span>
    </div>
  );
}
