"use client";

import { useEffect, useRef, useState } from "react";
import {
  Disc3,
  Expand,
  Minimize,
  Music,
  PlayCircle,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  if (!src) return null;

  const controlClass =
    "absolute right-[18px] z-40 h-[46px] w-[46px] rounded-full border-0 bg-white/0 text-white shadow-[0_6px_18px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:bg-white/50 hover:text-white";

  return (
    <div className="fixed bottom-2 right-2 z-100">
      <audio
        ref={audioRef}
        src={src}
        loop
        onError={() => {
          setIsPlaying(false);
          wasPlayingRef.current = false;
        }}
      />

      {/* <button
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
      </button> */}

      <Button
        className={cn(
          "tpl-fullscreen-btn bottom-[max(78px,calc(env(safe-area-inset-bottom)+78px))]",
          controlClass,
          fullscreen && "active",
        )}
        size="icon"
        type="button"
        aria-label={fullscreen ? "Keluar dari layar penuh" : "Buka layar penuh"}
        onClick={() => {
          if (document.fullscreenElement) void document.exitFullscreen();
          else void document.documentElement.requestFullscreen?.();
        }}
      >
        {fullscreen ? <Minimize /> : <Expand />}
      </Button>
      <Button
        className={cn(
          "bottom-[max(22px,calc(env(safe-area-inset-bottom)+22px))]",
          controlClass,
        )}
        size="icon"
        type="button"
        aria-label={!isPlaying ? "Putar musik" : "Jeda musik"}
        aria-pressed={isPlaying}
        onClick={togglePlay}
      >
        {!isPlaying ? <VolumeX /> : <Music />}
      </Button>
    </div>
  );
}
