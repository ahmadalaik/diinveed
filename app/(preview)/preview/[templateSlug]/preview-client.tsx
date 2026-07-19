"use client";

import {
  DEFAULT_TEMPLATE_SLUG,
  TEMPLATES,
} from "@/features/template/registry/templates";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { useEffect, useState, useSyncExternalStore } from "react";

function createDirectPreviewInvitation(templateSlug: string): InvitationState {
  return {
    id: "preview",
    userId: "preview",
    slug: "preview",
    publicToken: "preview",
    title: "The Wedding of Amelia & Theo",
    coverDesktopImage:
      "https://images.pexels.com/photos/24023256/pexels-photo-24023256.jpeg",
    coverDesktopImageKey: null,
    coverMobileImage:
      "https://images.pexels.com/photos/19714385/pexels-photo-19714385.jpeg",
    coverMobileImageKey: null,
    music:
      "https://pub-3f4024c2e27241cd8bb9531a1d174687.r2.dev/eclat-bentuk_cinta.mp4",
    musicKey: "",
    musicFileName: null,
    quote:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    quoteReference: "Ar-Rum: 21",
    isBrideFirst: true,
    brideName: "Amelia",
    brideNickname: "Amel",
    brideDescription: "Putri pertama dari keluarga tercinta.",
    brideImage:
      "https://images.pexels.com/photos/19714385/pexels-photo-19714385.jpeg",
    brideImageKey: null,
    groomName: "Theo",
    groomNickname: "Theo",
    groomDescription: "Putra pertama dari keluarga tercinta.",
    groomImage:
      "https://images.pexels.com/photos/19714385/pexels-photo-19714385.jpeg",
    groomImageKey: null,
    coupleSceneImage: null,
    coupleSceneImageKey: null,
    livestreamUrl: null,
    dressCode: { enabled: false, description: "", colors: [] },
    events: [
      {
        id: "preview-akad",
        date: "2026-08-08",
        timeStart: "09:00",
        timeEnd: "11:00",
        timezone: "WIB",
        title: "Akad Nikah",
        description: "Prosesi akad bersama keluarga dan sahabat terdekat.",
        locationName: "Diinveed Garden Hall",
        mapsUrl: "https://maps.google.com",
      },
      {
        id: "preview-resepsi",
        date: "2026-08-08",
        timeStart: "18:30",
        timeEnd: "21:00",
        timezone: "WIB",
        title: "Resepsi",
        description: "Malam perayaan penuh doa dan kebahagiaan.",
        locationName: "Diinveed Ballroom",
        mapsUrl: "https://maps.google.com",
      },
    ],
    stories: {
      enabled: true,
      items: [
        {
          id: "preview-story-1",
          year: "2024",
          title: "Awal Cerita",
          body: "Sebuah pertemuan sederhana yang tumbuh menjadi perjalanan bersama.",
        },
        {
          id: "preview-story-2",
          year: "2025",
          title: "Tunangan",
          body: "Komitmen untuk melangkah ke jalan yang serius",
        },
        {
          id: "preview-story-3",
          year: "2025",
          title: "Tunangan",
          body: "Komitmen untuk melangkah ke jalan yang serius",
        },
      ],
    },
    gallery: {
      enabled: true,
      items: [
        {
          id: "preview-gallery-1",
          url: "https://images.pexels.com/photos/19714384/pexels-photo-19714384.jpeg",
          key: "preview-gallery-1",
        },
        {
          id: "preview-gallery-2",
          url: "https://images.pexels.com/photos/19714749/pexels-photo-19714749.jpeg",
          key: "preview-gallery-2",
        },
        {
          id: "preview-gallery-3",
          url: "https://images.pexels.com/photos/19714750/pexels-photo-19714750.jpeg",
          key: "preview-gallery-3",
        },
        {
          id: "preview-gallery-4",
          url: "https://images.pexels.com/photos/19714386/pexels-photo-19714386.jpeg",
          key: "preview-gallery-4",
        },
        {
          id: "preview-gallery-5",
          url: "https://images.pexels.com/photos/24023257/pexels-photo-24023257.jpeg",
          key: "preview-gallery-5",
        },
      ],
    },
    gifts: {
      enabled: true,
      transfers: [
        {
          id: "preview-transfer-1",
          provider: "BCA",
          accountName: "Theodore",
          accountNumber: "1234567890",
        },
      ],
      packages: [
        {
          id: "preview-package-1",
          recipientName: "Amelia",
          recipientPhoneNumber: "081234567890",
          address: "Jl. Kebahagiaan No. 1, Jakarta Selatan",
        },
      ],
    },
    rsvpDeadline: "2026-08-01",
    rsvpOptions: { accept: true, decline: true, maybe: true, plusOne: false },
    wishesOptions: {
      enabled: true,
      reviewMode: false,
      allowPublic: true,
      showCategory: true,
    },
    tokenOverrides: null,
    templateSlug,
    backgroundType: "solid",
    isPublished: false,
  };
}

export function PreviewClient({ templateSlug }: { templateSlug: string }) {
  const resolvedSlug = Object.hasOwn(TEMPLATES, templateSlug)
    ? templateSlug
    : DEFAULT_TEMPLATE_SLUG;
  const SelectedTemplate = TEMPLATES[resolvedSlug];

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const html = document.documentElement;
    const prevColorScheme = html.style.colorScheme;
    const prevBackground = html.style.background;
    html.style.colorScheme = "dark";
    html.style.background = "#000";
    return () => {
      html.style.colorScheme = prevColorScheme;
      html.style.background = prevBackground;
    };
  }, []);

  const [invitation] = useState<InvitationState>(() =>
    createDirectPreviewInvitation(resolvedSlug),
  );

  if (!SelectedTemplate || !isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SelectedTemplate invitation={invitation} mode="guest" />
    </div>
  );
}
