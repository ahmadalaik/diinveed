"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MixtapeStoryControlsProps = {
  open: boolean;
  visible: boolean;
  autoPlay?: boolean;
  src: string;
  paused: boolean;
  onPausedChange: (paused: boolean) => void;
};

export function MixtapeStoryControls({
  open,
  visible,
  autoPlay = true,
  src,
  paused,
  onPausedChange,
}: MixtapeStoryControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const openRef = useRef(open);
  const visibleRef = useRef(visible);
  const pausedRef = useRef(paused);
  const onPausedChangeRef = useRef(onPausedChange);
  const resumeAudioAfterHiddenRef = useRef(false);
  const resumeStoryAfterHiddenRef = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    openRef.current = open;
    visibleRef.current = visible;
    pausedRef.current = paused;
    onPausedChangeRef.current = onPausedChange;
  }, [onPausedChange, open, paused, visible]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!open || paused) {
      audio.pause();
      return;
    }

    if (autoPlay) {
      audio.play().catch(() => {});
    }
  }, [autoPlay, open, paused, src]);

  useEffect(() => {
    function handleVisibilityChange() {
      const audio = audioRef.current;

      if (document.hidden) {
        resumeAudioAfterHiddenRef.current = Boolean(audio && !audio.paused);
        audio?.pause();

        resumeStoryAfterHiddenRef.current =
          openRef.current && visibleRef.current && !pausedRef.current;
        if (resumeStoryAfterHiddenRef.current) {
          onPausedChangeRef.current(true);
        }
        return;
      }

      if (resumeStoryAfterHiddenRef.current) {
        resumeStoryAfterHiddenRef.current = false;
        onPausedChangeRef.current(false);
      }

      if (resumeAudioAfterHiddenRef.current && audio) {
        resumeAudioAfterHiddenRef.current = false;
        audio.play().catch(() => {});
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function toggleMuted() {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
  }

  return (
    <>
      {src ? <audio ref={audioRef} src={src} loop /> : null}

      {visible ? (
        <div className="pointer-events-none fixed top-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 justify-end px-3">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-full text-white">
            {src ? (
              <button
                type="button"
                aria-label={muted ? "Nyalakan suara" : "Bisukan musik"}
                aria-pressed={muted}
                onClick={toggleMuted}
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {muted ? (
                  <VolumeX size={20} aria-hidden="true" />
                ) : (
                  <Volume2 size={20} aria-hidden="true" />
                )}
              </button>
            ) : null}

            <button
              type="button"
              aria-label={paused ? "Lanjutkan story" : "Jeda story"}
              aria-pressed={paused}
              onClick={() => onPausedChange(!paused)}
              className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {paused ? (
                <Play size={20} fill="currentColor" aria-hidden="true" />
              ) : (
                <Pause size={20} fill="currentColor" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
