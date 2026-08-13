"use client";

import { Heart, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { useOurifyAudio } from "./ourify-audio";
import { getCoupleNames, resolveCoverArtwork } from "./ourify-data";
import { OurifyArtwork, OurifyWaveMark } from "./ourify-image";

export function OurifyTopbar({
  invitation,
  visible = true,
}: {
  invitation: InvitationState;
  visible?: boolean;
}) {
  return (
    <header
      data-testid="ourify-topbar"
      aria-hidden={!visible}
      className={cn(
        "fixed top-0 left-1/2 z-50 flex h-[50px] w-full max-w-[480px] -translate-x-1/2 items-center bg-[rgba(18,18,18,0.92)] px-4 backdrop-blur-md transition-[opacity,transform] duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <OurifyWaveMark className="size-7 shrink-0 text-(--tpl-text-tertiary)" />
        <p className="truncate text-[12px] leading-tight font-extrabold">
          {getCoupleNames(invitation)}
        </p>
      </div>
    </header>
  );
}

export function OurifyMiniPlayer({
  invitation,
}: {
  invitation: InvitationState;
}) {
  const audio = useOurifyAudio();
  const coupleNames = getCoupleNames(invitation);
  const trackTitle =
    invitation.musicFileName?.replace(/\.[^.]+$/, "") || "Our Forever Song";
  const label = audio.unavailable
    ? "Musik tidak tersedia"
    : audio.isPlaying
      ? "Jeda musik"
      : "Putar musik";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[55] mx-auto w-full max-w-[480px] px-2">
      <div
        data-testid="ourify-mini-player"
        className="pointer-events-auto relative flex h-[60px] items-center gap-2 overflow-hidden rounded-md bg-[#3d3d3d] p-2 shadow-[0_-14px_42px_rgba(0,0,0,0.32)]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <OurifyArtwork
            src={resolveCoverArtwork(invitation, "mobile")}
            alt=""
            fallbackLabel={`Artwork mini player ${coupleNames}`}
            sizes="48px"
            preload
            className="size-11 shrink-0 rounded-[3px]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] leading-tight font-semibold text-(--tpl-text-primary)">
              {trackTitle}
            </p>
            <p className="mt-1 truncate text-[11px] leading-none text-(--tpl-text-secondary)">
              {coupleNames}
            </p>
          </div>
          <Heart
            aria-hidden="true"
            className="size-4 shrink-0 text-(--tpl-text-tertiary)"
            fill="currentColor"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          disabled={audio.unavailable}
          onClick={() => void audio.toggle()}
          className="size-10 shrink-0 rounded-full text-white hover:bg-white/10 hover:text-white"
        >
          {audio.isPlaying ? (
            <Pause fill="currentColor" />
          ) : (
            <Play fill="currentColor" />
          )}
        </Button>
        {audio.progress !== null ? (
          <Progress
            aria-label="Progres musik"
            value={audio.progress * 100}
            className="absolute right-0 bottom-0 left-0 h-0.5 rounded-none"
          />
        ) : null}
      </div>
    </div>
  );
}
