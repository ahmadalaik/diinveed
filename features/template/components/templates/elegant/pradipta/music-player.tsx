"use client";

import { useEffect, useRef, useState } from "react";
import { Disc3, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  autoPlay?: boolean;
  src: string;
}

export function MusicPlayer({ open, autoPlay = true, src }: Props) {
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

    if (open && autoPlay) {
      void audio.play().catch(() => {
        setIsPlaying(false);
        wasPlayingRef.current = false;
      });
    } else if (!open) {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [open, autoPlay]);

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
        void audio.play().catch(() => {
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
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play().catch(() => {
        setIsPlaying(false);
        wasPlayingRef.current = false;
      });
    }
  };

  if (!src) return null;

  return (
    <div className="fixed top-6 right-6 z-100">
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
        onClick={togglePlay}
        className={cn(
          "p-3 rounded-full transition-all text-stone-50/80 flex items-center justify-center pointer-events-auto",
          "bg-(--tpl-btn-bg-primary) hover:bg-(--tpl-btn-bg-secondary)",
          isPlaying && "animate-[spin_3s_linear_infinite]",
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
