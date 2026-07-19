import {
  BookHeart,
  CalendarDays,
  Gift,
  Heart,
  Images,
  Info,
  LayoutTemplate,
  MailCheck,
  Palette,
  Quote,
  Type,
  type LucideIcon,
} from "lucide-react";
import { BasicsSection } from "../components/editor/content/sections/basic";
import { CoupleSection } from "../components/editor/content/sections/couple";
import { EventsSection } from "../components/editor/content/sections/event";
import { StoriesSection } from "../components/editor/content/sections/story";
import { GallerySection } from "../components/editor/content/sections/gallery";
import { GiftsSection } from "../components/editor/content/sections/gift";
import { RsvpSection } from "../components/editor/content/sections/rsvp";
import { TemplateSelectorSection } from "../components/editor/content/sections/template-selector-section";
import { ColorSection } from "../components/editor/content/sections/color";
import { FontSection } from "../components/editor/content/sections/typography";
import { QuoteSection } from "../components/editor/content/sections/quote";

type SectionItem = {
  value: string;
  label: string;
  summary: string;
  Icon: LucideIcon;
  Content: React.ComponentType;
  fields?: string[];
};

type SectionCategory = {
  category: string;
  items: SectionItem[];
};

export const CATEGORIZED_SECTIONS: SectionCategory[] = [
  {
    category: "KONTEN UTAMA",
    items: [
      {
        value: "basics",
        label: "Informasi Dasar",
        summary: "Judul, URL slug & music",
        Icon: Info,
        Content: BasicsSection,
        fields: ["title", "slug", "music"],
      },
      {
        value: "couple",
        label: "Mempelai Pria & Wanita",
        summary: "Nama & foto pasangan",
        Icon: Heart,
        Content: CoupleSection,
        fields: [
          "brideName",
          "brideNickname",
          "brideDescription",
          "brideImage",
          "groomName",
          "groomNickname",
          "groomDescription",
          "groomImage",
        ],
      },
      {
        value: "quote",
        label: "Kutipan & Doa",
        summary: "Ayat / kata mutiara",
        Icon: Quote,
        Content: QuoteSection,
        fields: ["quote", "quoteReference"],
      },
    ],
  },
  {
    category: "WAKTU & INTERAKSI",
    items: [
      {
        value: "events",
        label: "Waktu & Lokasi Acara",
        summary: "Tanggal & tempat acara",
        Icon: CalendarDays,
        Content: EventsSection,
        fields: ["events"],
      },
      {
        value: "stories",
        label: "Cerita Kita",
        summary: "Momen perjalanan rindu",
        Icon: BookHeart,
        Content: StoriesSection,
        fields: ["stories"],
      },
      {
        value: "gallery",
        label: "Galeri Foto",
        summary: "Album foto kenangan",
        Icon: Images,
        Content: GallerySection,
        fields: ["gallery"],
      },
      {
        value: "gifts",
        label: "Amplop Digital & Hadiah",
        summary: "Nomor rekening & alamat",
        Icon: Gift,
        Content: GiftsSection,
        fields: ["gifts"],
      },
      {
        value: "rsvp",
        label: "Konfirmasi RSVP",
        summary: "Batas waktu & opsi kehadiran",
        Icon: MailCheck,
        Content: RsvpSection,
        fields: ["rsvpDeadline", "rsvpOptions"],
      },
    ],
  },
  {
    category: "GAYA & DESAIN",
    items: [
      {
        value: "template",
        label: "Pilihan Templat",
        summary: "Katalog templat pilihan",
        Icon: LayoutTemplate,
        Content: TemplateSelectorSection,
      },
      {
        value: "color",
        label: "Warna",
        summary: "Palet warna utama",
        Icon: Palette,
        Content: ColorSection,
      },
      {
        value: "font",
        label: "Tipografi",
        summary: "Pilihan jenis huruf",
        Icon: Type,
        Content: FontSection,
      },
    ],
  },
];
