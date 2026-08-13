"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  mergeTemplateTokenOverrides,
  ourifyTokens,
  templateCssVars,
} from "@/features/template/tokens";
import type { TemplateProps } from "../types";
import { OurifyCouple } from "./ourify-artists";
import { OurifyAudioProvider } from "./ourify-audio";
import { OurifyMiniPlayer, OurifyTopbar } from "./ourify-chrome";
import {
  OurifyFullscreenControl,
  OurifyThemeSwitcher,
} from "./ourify-controls";
import { OurifyCountdown } from "./ourify-countdown";
import { OurifyCover } from "./ourify-cover";
import { OurifyGallery } from "./ourify-discography";
import { OurifyDressCode } from "./ourify-dress-code";
import { OurifyEvents } from "./ourify-events";
import { OurifyFooter } from "./ourify-footer";
import { OurifyGifts } from "./ourify-gifts";
import { OurifyVerse } from "./ourify-lyrics";
import { OurifyStory } from "./ourify-playlist";
import {
  OURIFY_REVIEW_PLACEHOLDERS,
  type OurifyReviewPalette,
} from "./ourify-review-placeholders";
import { OurifyRsvpAndWishes } from "./ourify-rsvp-wishes";
import { OurifyVideo } from "./ourify-video";

const subscribeToFullscreenSupport = () => () => undefined;

export default function OurifyTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
  guest,
  canRsvp,
}: TemplateProps) {
  const [opened, setOpened] = useState(mode === "preview");
  const [coverVisible, setCoverVisible] = useState(mode !== "preview");
  const [topbarVisible, setTopbarVisible] = useState(!invitation.quote.trim());
  const [paletteId, setPaletteId] =
    useState<OurifyReviewPalette["id"]>("classic");
  const fullscreenAvailable = useSyncExternalStore(
    subscribeToFullscreenSupport,
    () =>
      Boolean(
        document.fullscreenEnabled &&
        document.documentElement.requestFullscreen,
      ),
    () => false,
  );
  const resolvedTokens = useMemo(
    () => mergeTemplateTokenOverrides(ourifyTokens, invitation.tokenOverrides),
    [invitation.tokenOverrides],
  );
  const cssVars = useMemo(
    () => templateCssVars(resolvedTokens),
    [resolvedTokens],
  );
  const selectedPalette = OURIFY_REVIEW_PLACEHOLDERS.palettes.find(
    (palette) => palette.id === paletteId,
  );
  const accent =
    paletteId === "classic"
      ? resolvedTokens.colors.text.tertiary
      : (selectedPalette?.accent ?? resolvedTokens.colors.text.tertiary);
  const canvasStyle = {
    ...cssVars,
    "--ourify-accent": accent,
    "--ourify-verse": selectedPalette?.verse ?? accent,
    "--tpl-text-tertiary": accent,
    "--tpl-btn-bg-primary": accent,
    colorScheme: "dark",
  } as CSSProperties;

  useEffect(() => {
    if (opened) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [opened]);

  useEffect(() => {
    if (
      !opened ||
      !invitation.quote.trim() ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const verse = document.querySelector("[data-ourify-section='verse']");
    if (!verse) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setTopbarVisible(!entry.isIntersecting);
    });
    observer.observe(verse);

    return () => observer.disconnect();
  }, [invitation.quote, opened]);

  return (
    <div
      style={canvasStyle}
      className="min-h-dvh bg-black text-(--tpl-text-primary)"
    >
      <OurifyAudioProvider source={invitation.music}>
        {coverVisible ? (
          <OurifyCover
            invitation={invitation}
            guestName={guestName}
            onOpen={() => setOpened(true)}
            onExitComplete={() => setCoverVisible(false)}
          />
        ) : null}

        <div
          data-testid="ourify-app-canvas"
          style={canvasStyle}
          className="relative mx-auto min-h-dvh w-full max-w-[480px] overflow-x-clip bg-[#121212] pb-[76px] font-(family-name:--font-figtree) shadow-[0_0_80px_rgba(0,0,0,0.45)]"
        >
          <a
            href="#ourify-main"
            className="sr-only z-50 rounded-full bg-(--tpl-btn-bg-primary) px-4 py-2 font-semibold text-(--tpl-btn-text-primary) focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Lewati ke isi undangan
          </a>
          {opened ? (
            <OurifyTopbar invitation={invitation} visible={topbarVisible} />
          ) : null}
          <main id="ourify-main" tabIndex={-1}>
            <h1 className="sr-only">
              Undangan pernikahan {invitation.brideNickname} &amp;{" "}
              {invitation.groomNickname}
            </h1>
            <OurifyVerse invitation={invitation} />
            <OurifyCouple invitation={invitation} />
            <OurifyStory invitation={invitation} />
            <OurifyCountdown
              events={invitation.events}
              countdownEventId={invitation.countdownEventId}
              countdownEnded={invitation.countdownEnded}
            />
            <OurifyEvents invitation={invitation} />
            <OurifyDressCode invitation={invitation} />
            <OurifyGallery invitation={invitation} />
            <OurifyVideo configuredUrl={undefined} />
            {canRsvp || mode === "preview" ? <OurifyRsvpAndWishes
              invitation={invitation}
              mode={mode}
              guestSlug={guestSlug}
              guestName={guestName}
              sessions={guest?.sessions ?? []}
            /> : null}
            <OurifyGifts invitation={invitation} />
          </main>
          <OurifyFooter invitation={invitation} />
        </div>

        <OurifyThemeSwitcher
          paletteId={paletteId}
          onPaletteChange={setPaletteId}
        />
        {opened ? (
          <>
            <OurifyFullscreenControl available={fullscreenAvailable} />
            <OurifyMiniPlayer invitation={invitation} />
          </>
        ) : null}
      </OurifyAudioProvider>
    </div>
  );
}
