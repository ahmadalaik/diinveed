"use client";

import { cn } from "@/lib/utils";
import { Disc3, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEMO_MUSIC } from "@/lib/demo-assets";

interface Props {
  open: boolean;
  autoPlay?: boolean;
}

export function MusicPlayer({ open, autoPlay = true }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    if (open && autoPlay) {
      audio
        .play()
        .catch((err) => console.log("Autoplay is blocked by browser: ", err));
    } else if (!open) {
      audio.pause();
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [open, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.error("Playback error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-6 right-6 z-100">
      <audio
        ref={audioRef}
        src={DEMO_MUSIC}
        loop
      />

      <button
        onClick={togglePlay}
        className={cn(
          "bg-[#2c2c2c] hover:bg-[#6b7c62] p-3 rounded-full transition-all text-stone-50/80 flex items-center justify-center pointer-events-auto",
          isPlaying && "animate-spin-slow",
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
