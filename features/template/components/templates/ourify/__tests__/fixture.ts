import { DEFAULT_INVITATION_STORE_STATE } from "@/features/invitation/store/invitation-store";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

export const ourifyFixture: InvitationState = {
  ...DEFAULT_INVITATION_STORE_STATE,
  id: "ourify-preview",
  slug: "amelia-theo",
  publicToken: "preview",
  title: "The Wedding of Amelia & Theo",
  coverDesktopImage:
    "https://images.pexels.com/photos/24023256/pexels-photo-24023256.jpeg",
  coverMobileImage:
    "https://images.pexels.com/photos/19714385/pexels-photo-19714385.jpeg",
  music: "/our-song.mp3",
  musicFileName: "Bentuk Cinta.mp3",
  quote: "Kita bertemu. Kita bertumbuh! Kini kita pulang bersama?",
  quoteReference: "Our Story",
  brideName: "Amelia Putri",
  brideNickname: "Amelia",
  brideDescription: "Putri pertama dari keluarga tercinta.",
  brideImage:
    "https://images.pexels.com/photos/19714384/pexels-photo-19714384.jpeg",
  groomName: "Theodore Wijaya",
  groomNickname: "Theo",
  groomDescription: "Putra pertama dari keluarga tercinta.",
  groomImage:
    "https://images.pexels.com/photos/19714749/pexels-photo-19714749.jpeg",
  events: [
    {
      id: "reception",
      date: "2026-08-08",
      timeStart: "18:30",
      timeEnd: "21:00",
      timezone: "WIB",
      title: "Resepsi",
      description: "Malam perayaan bersama keluarga dan sahabat.",
      locationName: "Diinveed Ballroom",
      mapsUrl: "https://maps.google.com/?q=Diinveed+Ballroom",
    },
    {
      id: "ceremony",
      date: "2026-08-08",
      timeStart: "09:00",
      timeEnd: "11:00",
      timezone: "WIB",
      title: "Akad Nikah",
      description: "Prosesi akad bersama keluarga terdekat.",
      locationName: "Diinveed Garden Hall",
      mapsUrl: "https://maps.google.com/?q=Diinveed+Garden+Hall",
    },
  ],
  stories: {
    enabled: true,
    items: [
      {
        id: "met",
        year: "2024",
        title: "Awal Cerita",
        body: "Pertemuan sederhana yang menjadi perjalanan.",
      },
      {
        id: "engaged",
        year: "2025",
        title: "Satu Tujuan",
        body: "Kami memilih untuk berjalan bersama.",
      },
    ],
  },
  gallery: {
    enabled: true,
    items: [
      {
        id: "photo-1",
        key: "photo-1",
        url: "https://images.pexels.com/photos/19714384/pexels-photo-19714384.jpeg",
      },
      { id: "photo-empty", key: "photo-empty", url: "" },
      {
        id: "photo-2",
        key: "photo-2",
        url: "https://images.pexels.com/photos/19714749/pexels-photo-19714749.jpeg",
      },
    ],
  },
  gifts: {
    enabled: true,
    transfers: [
      {
        id: "bank",
        provider: "BCA",
        accountName: "Amelia Putri",
        accountNumber: "1234567890",
      },
    ],
    packages: [
      {
        id: "parcel",
        recipientName: "Amelia",
        recipientPhoneNumber: "081234567890",
        address: "Jl. Bahagia No. 1, Jakarta",
      },
    ],
  },
  dressCode: {
    enabled: true,
    description: "Earth tone dan warna netral.",
    colors: ["#8b6f47", "#d8c3a5", "#f5f1e8"],
  },
  livestreamUrl: "https://www.youtube.com/watch?v=ourify",
  wishesOptions: {
    enabled: true,
    reviewMode: false,
    allowPublic: true,
    showCategory: true,
  },
  templateSlug: "ourify",
};
