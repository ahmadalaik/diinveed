"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { DikaraCover } from "./dikara-cover";
import { DikaraPreloader } from "./dikara-preloader";
import type { TemplateProps } from "../../types";
import { DikaraLayout } from "./layout/dikara-layout";
import { DikaraBanner } from "./dikara-banner";
import { DikaraQuote } from "./dikara-quote";
import { DikaraCouple } from "./dikara-couple";
import { DikaraCountdown } from "./dikara-countdown";
import { DikaraEvents } from "./dikara-events";
import { DikaraStories } from "./dikara-stories";
import { DikaraGifts } from "./dikara-gifts";
import { DikaraRsvp } from "./dikara-rsvp";
import { DikaraFooter } from "./dikara-footer";
import { MusicPlayer } from "./dikara-music-player";
import { Lightbox } from "../../shared/lightbox";
import {
  dikaraTokens,
  templateCssVars,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";
import styles from "./dikara.module.css";
import { Gallery } from "../../shared/gallery";

export default function DikaraTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
  guest,
  canRsvp,
}: TemplateProps) {
  // const isPreview = mode === "preview";
  const isPreview = true;
  const [opened, setOpened] = useState(!isPreview);
  const templateTokens = useMemo(
    () => mergeTemplateTokenOverrides(dikaraTokens, invitation.tokenOverrides),
    [invitation.tokenOverrides],
  );
  const templateStyle = useMemo<CSSProperties>(
    () => ({
      ...templateCssVars(templateTokens),
      "--dikara-accent": templateTokens.colors.button.primary.background,
      "--dikara-surface": templateTokens.colors.background.secondary,
      "--dikara-text": templateTokens.colors.text.primary,
    }),
    [templateTokens],
  );
  const [loading, setLoading] = useState(!isPreview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages = useMemo(
    () => invitation.gallery.items.filter((gallery) => gallery.url),
    [invitation.gallery.items],
  );

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeLightbox, lightboxOpen]);

  return (
    <div style={templateStyle} className={styles.templateRoot}>
      {loading && (
        <DikaraPreloader inv={invitation} onDone={() => setLoading(false)} />
      )}

      <div className="fixed inset-0 z-40 bg-[url('https://transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />

      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        images={galleryImages}
        activeIndex={lightboxIndex}
        setActiveIndex={setLightboxIndex}
      />

      <div
        className={`relative w-full h-dvh overflow-hidden font-(family-name:--tpl-font-body) ${styles.contentSurface}`}
      >
        <div className="hidden lg:block fixed left-0 top-0 w-[65%] h-dvh">
          <DikaraBanner inv={invitation} />
        </div>
        {!opened && (
          <DikaraCover
            inv={invitation}
            onOpen={setOpened}
            guestName={guestName}
          />
        )}

        <DikaraLayout inv={invitation}>
          <MusicPlayer
            open={opened}
            autoPlay={mode === "guest"}
            src={invitation.music}
          />

          <DikaraQuote inv={invitation} />
          <DikaraCouple inv={invitation} />
          <DikaraCountdown inv={invitation} />
          <DikaraEvents inv={invitation} />
          {invitation.stories?.enabled && <DikaraStories inv={invitation} />}
          {invitation.gallery?.enabled && (
            <Gallery
              inv={invitation}
              layoutMode="masonry"
              openLightbox={openLightbox}
            />
          )}
          {invitation.gifts?.enabled && <DikaraGifts inv={invitation} />}
          {canRsvp || isPreview ? (
            <DikaraRsvp
              inv={invitation}
              publicToken={invitation.publicToken}
              mode={mode}
              guestSlug={guestSlug}
              guestName={guestName}
              sessions={guest?.sessions ?? []}
            />
          ) : null}
          <DikaraFooter inv={invitation} />
        </DikaraLayout>
      </div>
    </div>
  );
}
