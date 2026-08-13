"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type OurifyAudioController = {
  configured: boolean;
  unavailable: boolean;
  isPlaying: boolean;
  progress: number | null;
  play: () => Promise<boolean>;
  pause: () => void;
  toggle: () => Promise<boolean>;
};

const OurifyAudioContext = createContext<OurifyAudioController | null>(null);

export function useOurifyAudio(): OurifyAudioController {
  const controller = useContext(OurifyAudioContext);
  if (!controller) {
    throw new Error("useOurifyAudio must be used inside OurifyAudioProvider");
  }
  return controller;
}

type OurifyAudioProviderProps = {
  source: string;
  children: React.ReactNode;
};

export function OurifyAudioProvider({
  source,
  children,
}: OurifyAudioProviderProps) {
  return (
    <OurifyAudioProviderInstance key={source} source={source}>
      {children}
    </OurifyAudioProviderInstance>
  );
}

function OurifyAudioProviderInstance({
  source,
  children,
}: OurifyAudioProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingRef = useRef(false);
  const resumeAfterVisibilityRef = useRef(false);
  const configured = source.trim().length > 0;
  const [isPlaying, setIsPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(!configured);
  const [progress, setProgress] = useState<number | null>(null);

  const markPlaying = useCallback((playing: boolean) => {
    playingRef.current = playing;
    setIsPlaying(playing);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    markPlaying(false);
  }, [markPlaying]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !configured || unavailable) return false;

    try {
      await audio.play();
      markPlaying(true);
      return true;
    } catch {
      markPlaying(false);
      return false;
    }
  }, [configured, markPlaying, unavailable]);

  const toggle = useCallback(async () => {
    if (playingRef.current) {
      pause();
      return false;
    }
    return play();
  }, [pause, play]);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) {
      setProgress(null);
      return;
    }

    setProgress(Math.min(1, Math.max(0, audio.currentTime / audio.duration)));
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        resumeAfterVisibilityRef.current = playingRef.current || !audio.paused;
        if (resumeAfterVisibilityRef.current) pause();
        return;
      }

      if (resumeAfterVisibilityRef.current) {
        resumeAfterVisibilityRef.current = false;
        void play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pause, play]);

  const controller = useMemo<OurifyAudioController>(
    () => ({
      configured,
      unavailable,
      isPlaying,
      progress,
      play,
      pause,
      toggle,
    }),
    [configured, isPlaying, pause, play, progress, toggle, unavailable],
  );

  return (
    <OurifyAudioContext.Provider value={controller}>
      {configured ? (
        <audio
          ref={audioRef}
          src={source}
          loop
          preload="none"
          onPlay={() => markPlaying(true)}
          onPause={() => markPlaying(false)}
          onDurationChange={updateProgress}
          onTimeUpdate={updateProgress}
          onError={() => {
            setUnavailable(true);
            setProgress(null);
            markPlaying(false);
          }}
        />
      ) : null}
      {children}
    </OurifyAudioContext.Provider>
  );
}
