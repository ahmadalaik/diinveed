"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { TemplateProps } from "../../types";
import { PradiptaCover } from "./pradipta-cover";
import { PradiptaPreloader } from "./pradipta-preloader";
import { Lightbox } from "../../shared/lightbox";
import { PradiptaLayout } from "./layout/pradipta-layout";
import { PradiptaBanner } from "./pradipta-banner";
import { PradiptaQuote } from "./pradipta-quote";
import { PradiptaCouple } from "./pradipta-couple";
import { PradiptaCountdown } from "./pradipta-countdown";
import { PradiptaEvents } from "./pradipta-events";
import { PradiptaStories } from "./pradipta-stories";
import { Gallery } from "../../shared/gallery";
import { PradiptaGifts } from "./pradipta-gifts";
import { PradiptaRsvp } from "./pradipta-rsvp";
import { PradiptaFooter } from "./pradipta-footer";
import { MusicPlayer } from "./music-player";
import {
  pradiptaTokens,
  templateCssVars,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";

export default function PradiptaTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
}: TemplateProps) {
  const isPreview = mode === "preview";
  const [opened, setOpened] = useState(isPreview);
  const [loading, setLoading] = useState(!isPreview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const cssVars = useMemo(() => {
    return templateCssVars(
      mergeTemplateTokenOverrides(pradiptaTokens, invitation.tokenOverrides),
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
        <PradiptaPreloader inv={invitation} onDone={() => setLoading(false)} />
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
          <PradiptaBanner inv={invitation} />
        </div>
        {!opened && (
          <PradiptaCover
            inv={invitation}
            onOpen={setOpened}
            guestName={guestName}
          />
        )}

        <PradiptaLayout>
          <MusicPlayer
            open={opened}
            autoPlay={mode === "guest"}
            src={invitation.music}
          />

          <PradiptaQuote inv={invitation} />
          <PradiptaCouple inv={invitation} />
          <PradiptaCountdown inv={invitation} />
          <PradiptaEvents inv={invitation} />
          {invitation.stories?.enabled && <PradiptaStories inv={invitation} />}
          {invitation.gallery?.enabled && (
            <Gallery
              inv={invitation}
              layoutMode="masonry"
              openLightbox={openLightbox}
              className="py-16 bg-(--tpl-bg-secondary)"
              overlayClassName=""
            />
          )}
          {invitation.gifts?.enabled && <PradiptaGifts inv={invitation} />}
          <PradiptaRsvp
            inv={invitation}
            publicToken={invitation.publicToken}
            mode={mode}
            guestSlug={guestSlug}
            guestName={guestName}
          />
          <PradiptaFooter inv={invitation} />
        </PradiptaLayout>
      </div>
    </div>
  );
}
