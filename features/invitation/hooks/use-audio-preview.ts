"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioPreview() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create the single audio element once so the play/pause callbacks only ever
  // operate on an existing ref (mutating a ref created inside a memoized
  // callback trips react-hooks/immutability).
  useEffect(() => {
    const audio = new Audio();
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentUrl(null);
    };
    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentUrl(null);
  }, []);

  const toggle = useCallback(
    (url: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentUrl === url && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (audio.src !== url) {
        audio.src = url;
      }
      void audio.play();
      setCurrentUrl(url);
      setIsPlaying(true);
    },
    [currentUrl, isPlaying],
  );

  return { currentUrl, isPlaying, toggle, stop };
}
