"use client";

import { useCallback, useState } from "react";

export type StoryController = {
  index: number;
  total: number;
  paused: boolean;
  next: () => void;
  prev: () => void;
  goTo: (target: number) => void;
  setPaused: (value: boolean) => void;
};

function clamp(value: number, max: number): number {
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

/**
 * Mengatur posisi di fase story.
 *
 * `next()` pada slide terakhir tidak menambah indeks — ia memanggil
 * `onFinish`, yang dipakai `index.tsx` untuk berpindah ke fase scroll.
 *
 * Dua keputusan yang disengaja, keduanya soal kebenaran React:
 *
 * 1. `onFinish()` dipanggil di badan callback, BUKAN di dalam updater
 *    `setState`. Updater wajib murni: React boleh memanggilnya lebih dari
 *    sekali (StrictMode) dan boleh memanggilnya saat render kalau ada
 *    update lain mengantre. Efek samping di dalamnya berarti perpindahan
 *    fase bisa terpicu ganda, atau memicu peringatan "cannot update a
 *    component while rendering a different component".
 *
 * 2. Indeks dijepit SAAT RENDER, bukan lewat `useEffect`. `total` diturunkan
 *    dari data undangan yang hidup, jadi sebuah slide bisa lenyap saat tamu
 *    sedang berada di sana (mis. galeri dikosongkan di live preview).
 *    Penjepitan lewat efek menyisakan satu commit yang masih merender indeks
 *    di luar rentang — cukup untuk membuat konsumen membaca `slides[index]`
 *    sebagai `undefined`.
 */
export function useStoryController(
  total: number,
  onFinish: () => void,
): StoryController {
  const [rawIndex, setRawIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const lastIndex = Math.max(0, total - 1);
  const index = clamp(rawIndex, lastIndex);

  const next = useCallback(() => {
    if (index >= lastIndex) {
      onFinish();
      return;
    }
    setRawIndex(index + 1);
  }, [index, lastIndex, onFinish]);

  const prev = useCallback(() => {
    setRawIndex(clamp(index - 1, lastIndex));
  }, [index, lastIndex]);

  const goTo = useCallback(
    (target: number) => setRawIndex(clamp(target, lastIndex)),
    [lastIndex],
  );

  return { index, total, paused, next, prev, goTo, setPaused };
}
