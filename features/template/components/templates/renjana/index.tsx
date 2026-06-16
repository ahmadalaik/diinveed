"use client";

import { useEffect, useState } from "react";
import type { TemplateProps } from "../types";
import { Lightbox } from "./lightbox";
import { RenjanaLayout } from "./layout/renjana-layout";
import { EnvelopeRenjana } from "./envelope-renjana";
import { BannerRenjana } from "./banner-renjana";
import { PrologRenjana } from "./prolog-renjana";
import { QuoteRenjana } from "./quote-renjana";
import { CoupleRenjana } from "./couple-renjana";
import { CountdownRenjana } from "./countdown-renjana";
import { EventsRenjana } from "./events-renjana";
import { StoriesRenjana } from "./stories-renjana";
import { GalleryRenjana } from "./gallery-renjana";
import { GiftsRenjana } from "./gifts-renjana";
import { RSVPRenjana } from "./rsvp-renjana";
import { WishesRenjana } from "./wishes-renjana";
import { FooterRenjana } from "./footer-renjana";
import { MusicPlayer } from "./music-player";

export default function RenjanaTemplate({
  invitation,
  mode = "guest",
  guestSlug,
  guestName,
}: TemplateProps) {
  const isPreview = mode === "preview";
  const [opened, setOpened] = useState(isPreview);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const openLightbox = (src: string) => {
    setLightboxImg(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxImg(null), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="font-(family-name:--font-montserrat)">
      <Lightbox
        lightboxOpen={lightboxOpen}
        closeLightbox={closeLightbox}
        lightboxImg={lightboxImg}
        mode={mode}
      />

      {!opened && (
        <EnvelopeRenjana
          inv={invitation}
          onOpen={setOpened}
          guestName={guestName}
        />
      )}

      <RenjanaLayout>
        <MusicPlayer open={opened} autoPlay={mode === "guest"} />

        <BannerRenjana inv={invitation} />
        <PrologRenjana inv={invitation} />
        <QuoteRenjana inv={invitation} />
        <CoupleRenjana inv={invitation} />
        <CountdownRenjana inv={invitation} />
        <EventsRenjana inv={invitation} />
        <StoriesRenjana inv={invitation} />
        <GalleryRenjana inv={invitation} openLightbox={openLightbox} />
        <GiftsRenjana inv={invitation} />
        <RSVPRenjana
          publicToken={invitation.publicToken}
          mode={mode}
          guestSlug={guestSlug}
          guestName={guestName}
        />
        {(invitation.wishesOptions?.enabled ?? true) && (
          <WishesRenjana
            publicToken={invitation.publicToken}
            showCategory={invitation.wishesOptions?.showCategory ?? false}
            mode={mode}
          />
        )}
        <FooterRenjana inv={invitation} />
      </RenjanaLayout>
    </div>
  );
}
