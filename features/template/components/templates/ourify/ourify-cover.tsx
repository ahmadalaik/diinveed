"use client";

import {
  ChevronDown,
  Heart,
  Infinity as InfinityIcon,
  ListMusic,
  MoreHorizontal,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/features/invitation/lib/datetime";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { resolveCountdownEvent } from "@/features/invitation/lib/countdown-event";
import { useOurifyAudio } from "./ourify-audio";
import {
  getCoupleNames,
  resolveCoverArtwork,
} from "./ourify-data";
import { OurifyArtwork } from "./ourify-image";
import { OURIFY_COVER_TRANSITION } from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

type OurifyCoverProps = {
  invitation: InvitationState;
  guestName?: string;
  onOpen: () => void;
  onExitComplete?: () => void;
};

export function OurifyCover({
  invitation,
  guestName,
  onOpen,
  onExitComplete,
}: OurifyCoverProps) {
  const audio = useOurifyAudio();
  const reduceMotion = useReducedMotion() ?? false;
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);
  const coupleNames = getCoupleNames(invitation);
  const event = resolveCountdownEvent(
    invitation.events,
    invitation.countdownEventId,
  );
  const eventDate = event
    ? formatDate(event.date, "EEEE, d MMMM yyyy")
    : "Tanggal akan segera diumumkan";

  useEffect(() => {
    if (!isExiting) return;

    const timeout = window.setTimeout(
      () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onExitComplete?.();
      },
      reduceMotion ? 0 : OURIFY_COVER_TRANSITION.transformDuration * 1000,
    );

    return () => window.clearTimeout(timeout);
  }, [isExiting, onExitComplete, reduceMotion]);

  const handleOpen = () => {
    if (isExiting) return;
    setIsExiting(true);
    onOpen();
    void audio.play();
  };

  return (
    <motion.div
      data-testid="ourify-cover"
      data-state={isExiting ? "exiting" : "closed"}
      data-transform-duration={OURIFY_COVER_TRANSITION.transformDuration}
      data-opacity-duration={OURIFY_COVER_TRANSITION.opacityDuration}
      initial={false}
      animate={isExiting ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{
        y: {
          duration: reduceMotion
            ? 0
            : OURIFY_COVER_TRANSITION.transformDuration,
          ease: OURIFY_COVER_TRANSITION.ease,
        },
        opacity: {
          duration: reduceMotion ? 0 : OURIFY_COVER_TRANSITION.opacityDuration,
        },
      }}
      className="fixed inset-0 z-[60] overflow-hidden bg-[#121212] text-white"
    >
      <style>{`
        @keyframes play-button-glow {
          0% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--tpl-text-tertiary, #1db954) 75%, transparent);
          }
          100% {
            box-shadow: 0 0 0 16px color-mix(in srgb, var(--tpl-text-tertiary, #1db954) 0%, transparent);
          }
        }
        .animate-play-glow {
          animation: play-button-glow 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col px-6 pt-[max(10px,env(safe-area-inset-top))] pb-[max(18px,env(safe-area-inset-bottom))]">
        <div className="grid h-11 grid-cols-[44px_1fr_44px] items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Buka undangan"
            onClick={handleOpen}
            data-cover-slot="chevron"
            className="size-11 rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <ChevronDown aria-hidden="true" className="size-6" />
          </Button>
          <div
            data-cover-slot="playing-from"
            className="text-center leading-tight"
          >
            <p className="text-[9px] font-bold tracking-[0.12em] uppercase">
              Playing From
            </p>
            <p className="mt-0.5 text-[11px] font-extrabold">The Wedding Of</p>
          </div>
          <MoreHorizontal
            aria-hidden="true"
            className="mx-auto size-5 text-white"
          />
        </div>

        <div data-cover-slot="artwork" className="mt-3">
          <OurifyArtwork
            src={resolveCoverArtwork(invitation, "mobile")}
            alt={`Sampul pernikahan ${coupleNames}`}
            fallbackLabel={`Artwork Ourify untuk ${coupleNames}`}
            sizes="(max-width: 480px) calc(100vw - 48px), 432px"
            preload
            className="w-full rounded-none shadow-[0_24px_64px_rgba(0,0,0,0.36)]"
          />
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] items-start gap-4">
          <div className="min-w-0">
            <h1
              data-cover-slot="couple"
              className="truncate text-[22px] leading-tight font-extrabold tracking-[-0.035em]"
            >
              {coupleNames}
            </h1>
            <p
              data-cover-slot="made-for"
              className="mt-1 text-[13px] leading-tight text-[#b3b3b3]"
            >
              Made for {guestName?.trim() || "Tamu Undangan"}
            </p>
          </div>
          <Heart
            data-cover-slot="favorite"
            aria-label="Lagu favorit"
            className="mt-1 size-6 text-(--tpl-text-tertiary)"
            fill="currentColor"
          />
        </div>

        <div data-cover-slot="progress" className="mt-4">
          <div aria-hidden="true" className="h-1 rounded-full bg-white/20">
            <div className="h-full w-0 rounded-full bg-white" />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#b3b3b3]">
            <span>0:00</span>
            <InfinityIcon aria-label="Diputar selamanya" className="size-3.5" />
          </div>
        </div>

        <div
          data-cover-slot="controls"
          className="mt-1 flex items-center justify-between"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Acak lagu"
            className="rounded-full text-(--tpl-text-tertiary) hover:bg-white/10 hover:text-(--tpl-text-tertiary)"
          >
            <Shuffle aria-hidden="true" className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Lagu sebelumnya"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <SkipBack
              aria-hidden="true"
              className="size-6"
              fill="currentColor"
            />
          </Button>
          <Button
            type="button"
            size="icon"
            aria-label="Buka undangan dan putar musik"
            onClick={handleOpen}
            className="size-16 rounded-full bg-(--tpl-text-tertiary) text-[#121212] hover:bg-(--tpl-text-tertiary)/90 animate-play-glow"
          >
            <Play
              aria-hidden="true"
              className="ml-1 size-7"
              fill="currentColor"
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Lagu berikutnya"
            className="rounded-full text-white hover:bg-white/10 hover:text-white"
          >
            <SkipForward
              aria-hidden="true"
              className="size-6"
              fill="currentColor"
            />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Antrean musik"
            className="rounded-full text-[#b3b3b3] hover:bg-white/10 hover:text-white"
          >
            <ListMusic aria-hidden="true" className="size-5" />
          </Button>
        </div>

        <p
          data-cover-slot="event-date"
          className="mt-4 text-center text-[15px] font-extrabold"
        >
          {eventDate}
        </p>
        <p
          data-cover-slot="intro"
          className="mx-auto mt-1 max-w-[320px] text-center text-[12px] leading-5 text-[#b3b3b3]"
        >
          {OURIFY_REVIEW_PLACEHOLDERS.introCopy}
        </p>
      </div>
    </motion.div>
  );
}
