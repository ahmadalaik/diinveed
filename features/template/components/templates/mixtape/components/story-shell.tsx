"use client";

import type { ReactNode } from "react";
import type { StoryController } from "../hooks/use-story-controller";
import { Grain } from "../motifs/grain";
import { StoryProgress } from "./story-progress";

type StoryShellProps = {
  controller: StoryController;
  tone: "lite" | "dark";
  children: ReactNode;
};

/**
 * Bingkai layar penuh untuk fase story.
 *
 * Navigasi memakai dua tombol tak terlihat yang menutupi kiri dan kanan
 * layar. Keduanya `<button>` sungguhan, bukan div ber-onClick, supaya
 * tetap terjangkau keyboard dan pembaca layar.
 */
export function StoryShell({ controller, tone, children }: StoryShellProps) {
  const isLite = tone === "lite";

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden"
      style={{
        backgroundColor: isLite
          ? "var(--tpl-bg-primary)"
          : "var(--tpl-bg-secondary)",
        color: isLite ? "var(--tpl-text-primary)" : "var(--tpl-text-secondary)",
      }}
    >
      <div className="relative z-30">
        <StoryProgress
          key={`${controller.index}:${controller.total}`}
          total={controller.total}
          index={controller.index}
          paused={controller.paused}
          onComplete={controller.next}
        />
      </div>

      {/*
        `min-h-0 flex-1` memberi area konten tepat sisa tinggi di bawah bar
        progres (tanpa ini `h-full` anak-anaknya meluap setinggi bar dan
        terpotong `overflow-hidden`). `overflow-y-auto` membiarkan slide yang
        sangat panjang (10 butir cerita / kutipan panjang) menggulung, bukan
        terpotong.
      */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">{children}</div>

      <button
        type="button"
        aria-label="Slide sebelumnya"
        onClick={controller.prev}
        className="absolute inset-y-0 left-0 z-40 w-1/3 cursor-default opacity-0"
      />
      <button
        type="button"
        aria-label="Slide berikutnya"
        onClick={controller.next}
        className="absolute inset-y-0 right-0 z-40 w-2/3 cursor-default opacity-0"
      />

      <Grain tone={tone} />
    </div>
  );
}
