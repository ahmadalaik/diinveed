"use client";

import { useEffect, useState } from "react";
import type { TemplateProps } from "../types";
import { Lightbox } from "./lightbox";
import { RenjanaLayout } from "./layout/renjana-layout";
import { EnvelopeRenjana } from "./renjana-cover";
import { BannerRenjana } from "./renjana-banner";
import { PrologRenjana } from "./renjana-prolog";
import { QuoteRenjana } from "./renjana-quote";
import { CoupleRenjana } from "./renjana-couple";
import { CountdownRenjana } from "./renjana-countdown";
import { EventsRenjana } from "./renjana-events";
import { StoriesRenjana } from "./renjana-stories";
import { GalleryRenjana } from "./renjana-gallery";
import { GiftsRenjana } from "./renjana-gifts";
import { RSVPRenjana } from "./renjana-rsvp";
import { WishesRenjana } from "./renjana-wishes";
import { FooterRenjana } from "./renjana-footer";
import { MusicPlayer } from "./renjana-music-player";

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
    <div className="font-montserrat">
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
        {invitation.stories?.enabled && <StoriesRenjana inv={invitation} />}
        {invitation.gallery?.enabled && (
          <GalleryRenjana inv={invitation} openLightbox={openLightbox} />
        )}
        {invitation.gifts?.enabled && <GiftsRenjana inv={invitation} />}
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
