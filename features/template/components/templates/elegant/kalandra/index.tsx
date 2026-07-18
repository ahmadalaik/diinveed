"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KalandraCover } from "./kalandra-cover";
import { KalandraPreloader } from "./kalandra-preloader";
import type { TemplateProps } from "../../types";
import { KalandraLayout } from "./layout/kalandra-layout";
import { KalandraBanner } from "./kalandra-banner";
import { KalandraQuote } from "./kalandra-quote";
import { KalandraCouple } from "./kalandra-couple";
import { KalandraCountdown } from "./kalandra-countdown";
import { KalandraEvents } from "./kalandra-events";
import { KalandraStories } from "./kalandra-stories";
import { KalandraGifts } from "./kalandra-gifts";
import { KalandraRsvpAndWishes } from "./kalandra-rsvp-wishes";
import { KalandraFooter } from "./kalandra-footer";
import { MusicPlayer } from "./music-player";
import {
  kalandraTokens,
  templateCssVars,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";
import { Lightbox } from "../../shared/lightbox";
import { Gallery } from "../../shared/gallery";

export default function KalandraTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
}: TemplateProps) {
  const isPreview = mode === "preview";
  const [opened, setOpened] = useState(isPreview);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const cssVars = useMemo(() => {
    return templateCssVars(
      mergeTemplateTokenOverrides(kalandraTokens, invitation.tokenOverrides),
    );
  }, [invitation.tokenOverrides]);

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
    <div style={cssVars}>
      {loading && (
        <KalandraPreloader inv={invitation} onDone={() => setLoading(false)} />
      )}

      <div className="fixed inset-0 z-40 bg-[url('https://transparenttextures.com/patterns/cream-paper.png')] opacity-60 pointer-events-none mix-blend-multiply" />

      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        images={galleryImages}
        activeIndex={lightboxIndex}
        setActiveIndex={setLightboxIndex}
      />

      <div className="relative w-full h-dvh overflow-hidden font-(family-name:--tpl-font-body)">
        <div className="hidden lg:block fixed left-0 top-0 w-[70%] h-dvh">
          <KalandraBanner inv={invitation} />
        </div>
        {!opened && (
          <KalandraCover
            inv={invitation}
            onOpen={setOpened}
            guestName={guestName}
          />
        )}

        <KalandraLayout inv={invitation}>
          <MusicPlayer
            open={opened}
            autoPlay={mode === "guest"}
            src={invitation.music}
          />

          <KalandraQuote inv={invitation} />
          <KalandraCouple inv={invitation} />
          <KalandraCountdown inv={invitation} />
          <KalandraEvents inv={invitation} />
          {invitation.stories?.enabled && <KalandraStories inv={invitation} />}
          {invitation.gallery?.enabled && (
            <Gallery
              inv={invitation}
              layoutMode="horizontal"
              openLightbox={openLightbox}
            />
          )}
          {invitation.gifts?.enabled && <KalandraGifts inv={invitation} />}
          <KalandraRsvpAndWishes
            inv={invitation}
            publicToken={invitation.publicToken}
            mode={mode}
            guestSlug={guestSlug}
            guestName={guestName}
            wishesEnabled={invitation.wishesOptions?.enabled ?? true}
          />
          <KalandraFooter inv={invitation} />
        </KalandraLayout>
      </div>
    </div>
  );
}
