"use client";

import { cn } from "@/lib/utils";
import { Disc3, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  autoPlay?: boolean;
  src: string;
  className?: string;
}

export function MusicPlayer({ open, autoPlay = true, src, className }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    if (!open) {
      audio.pause();
    }

    if (open && autoPlay) {
      audio.play().catch(() => {
        setIsPlaying(false);
        wasPlayingRef.current = false;
      });
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [open, autoPlay, src]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        const isPlaying = !audio.paused;
        wasPlayingRef.current = isPlaying;
        if (isPlaying) {
          audio.pause();
        }
        return;
      }

      if (wasPlayingRef.current) {
        audio.play().catch(() => {
          setIsPlaying(false);
          wasPlayingRef.current = false;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
        wasPlayingRef.current = false;
      });
    } else {
      audio.pause();
    }
  };

  if (!src) return null;

  return (
    <div className={cn("fixed top-6 right-6 z-100", className)}>
      <audio
        ref={audioRef}
        src={src}
        loop
        onError={() => {
          setIsPlaying(false);
          wasPlayingRef.current = false;
        }}
      />

      <button
        type="button"
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
        onClick={togglePlay}
        className={cn(
          "flex items-center justify-center p-3 rounded-full transition-all duration-300 pointer-events-auto",
          "bg-(--tpl-btn-bg-primary) hover:bg-(--tpl-btn-bg-secondary)",
          isPlaying && "animate-[spin_3s_linear_infinite]",
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none"
        )}
      >
        {isPlaying ? (
          <Disc3 strokeWidth={1.5} />
        ) : (
          <PlayCircle strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}
