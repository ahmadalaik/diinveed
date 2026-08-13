"use client";

import {
  DEFAULT_TEMPLATE_SLUG,
  TEMPLATES,
} from "@/features/template/registry/templates";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GoogleFontLoader } from "@/features/invitation/components/google-font-loader";

function createDirectPreviewInvitation(templateSlug: string): InvitationState {
  return {
    id: "preview",
    userId: "preview",
    slug: "preview",
    publicToken: "preview",
    title: "The Wedding of Zahra & Daffa",
    coverDesktopImage:
      "https://i.pinimg.com/originals/58/41/aa/5841aa2a9a65e6e04b22847ab0f7e284.jpg",
    coverDesktopImageKey: null,
    coverMobileImage:
      "https://i.pinimg.com/originals/ce/5b/53/ce5b530efe02beb91ef46de112ab5353.jpg",
    coverMobileImageKey: null,
    music:
      "https://pub-3f4024c2e27241cd8bb9531a1d174687.r2.dev/eclat-bentuk_cinta.mp4",
    musicKey: "",
    musicFileName: null,
    quote:
      "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
    quoteReference: "Ar-Rum: 21",
    isBrideFirst: true,
    brideName: "Zahra Putri",
    brideNickname: "Zahra",
    brideDescription: "Putri pertama dari keluarga tercinta.",
    brideImage:
      "https://i.pinimg.com/originals/01/7e/6e/017e6e400d34da746a33408a747ea2ec.jpg",
    brideImageKey: null,
    groomName: "Daffa Pratama",
    groomNickname: "Daffa",
    groomDescription: "Putra pertama dari keluarga tercinta.",
    groomImage:
      "https://i.pinimg.com/originals/84/21/61/842161664628613d67ffd5946ba9c34d.jpg",
    groomImageKey: null,
    relationshipStartDate: "2021-06-15",
    coupleSceneImage: null,
    coupleSceneImageKey: null,
    livestreamUrl: null,
    dressCode: { enabled: false, description: "", colors: [] },
    events: [
      {
        id: "preview-akad",
        date: "2026-10-10",
        timeStart: "09:00",
        timeEnd: "11:00",
        timezone: "WIB",
        title: "Akad Nikah",
        description: "Prosesi akad bersama keluarga dan sahabat terdekat.",
        locationName: "Onestoria Garden Hall",
        mapsUrl: "https://maps.google.com",
      },
      {
        id: "preview-resepsi",
        date: "2026-10-10",
        timeStart: "18:30",
        timeEnd: "21:00",
        timezone: "WIB",
        title: "Resepsi",
        description: "Malam perayaan penuh doa dan kebahagiaan.",
        locationName: "Onestoria Ballroom",
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
          title: "Menikah",
          body: "Mengikat sumpah setia dalam satu hati baik senang maupun susah",
        },
      ],
    },
    gallery: {
      enabled: true,
      items: [
        {
          id: "preview-gallery-1",
          url: "https://i.pinimg.com/originals/a2/b7/d9/a2b7d905d90e397c484cc61e808aa2af.jpg",
          key: "preview-gallery-1",
        },
        {
          id: "preview-gallery-2",
          url: "https://i.pinimg.com/originals/34/0a/25/340a25c2319d53dd63a2866063e562ac.jpg",
          key: "preview-gallery-2",
        },
        {
          id: "preview-gallery-3",
          url: "https://i.pinimg.com/originals/c4/32/84/c4328405373658313fdf43ce61e1b51c.jpg",
          key: "preview-gallery-3",
        },
        {
          id: "preview-gallery-4",
          url: "https://i.pinimg.com/originals/b9/a3/d7/b9a3d751fa8e12cec16530f59f0a0ed5.jpg",
          key: "preview-gallery-4",
        },
        {
          id: "preview-gallery-5",
          url: "https://i.pinimg.com/originals/93/37/a9/9337a9d9fc28966bcb676d5238e81ab8.jpg",
          key: "preview-gallery-5",
        },
        {
          id: "preview-gallery-6",
          url: "https://i.pinimg.com/originals/df/81/cd/df81cdfee5e912ebde3157dca3d4b990.jpg",
          key: "preview-gallery-6",
        },
        {
          id: "preview-gallery-7",
          url: "https://i.pinimg.com/originals/84/21/61/842161664628613d67ffd5946ba9c34d.jpg",
          key: "preview-gallery-7",
        },
        {
          id: "preview-gallery-8",
          url: "https://i.pinimg.com/originals/58/41/aa/5841aa2a9a65e6e04b22847ab0f7e284.jpg",
          key: "preview-gallery-8",
        },
      ],
    },
    gifts: {
      enabled: true,
      transfers: [
        {
          id: "preview-transfer-1",
          provider: "BCA",
          accountName: "Daffa Pratama",
          accountNumber: "1234567890",
        },
      ],
      packages: [
        {
          id: "preview-package-1",
          recipientName: "Zahra Putri",
          recipientPhoneNumber: "081234567890",
          address: "Jl. Kebahagiaan No. 1, Kudus",
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
      <GoogleFontLoader invitation={invitation} />
      <SelectedTemplate invitation={invitation} mode="guest" />
    </div>
  );
}
