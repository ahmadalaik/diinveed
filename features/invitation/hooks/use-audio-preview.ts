"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioPreview(syncUrl?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Create the single audio element once so the play/pause callbacks only ever
  // operate on an existing ref (mutating a ref created inside a memoized
  // callback trips react-hooks/immutability).
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata"; // Pastikan metadata di-load otomatis

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleError = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Preload syncUrl saat halaman dimuat agar durasinya langsung diketahui
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !syncUrl) return;

    // Hanya preload jika audio sedang tidak diputar dan url berbeda
    if (!isPlaying && audio.src !== syncUrl) {
      audio.src = syncUrl;
      setCurrentUrl(syncUrl);
    }
  }, [syncUrl, isPlaying]);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentUrl(null);
    setCurrentTime(0);
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
        setCurrentTime(0);
      }
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
      setCurrentUrl(url);
      setIsPlaying(true);
    },
    [currentUrl, isPlaying],
  );

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  return { currentUrl, isPlaying, currentTime, duration, toggle, stop, seek };
}
