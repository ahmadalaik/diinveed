"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookHeart,
  CalendarDays,
  Gift,
  Heart,
  Images,
  Info,
  MailCheck,
  Palette,
  Quote,
  Shirt,
  Type,
  Wallpaper,
  type LucideIcon,
} from "lucide-react";
import { TemplateSelectorSection } from "./sections/template-selector-section";
import { BasicsSection } from "./sections/basics-section";
import { CoupleSection } from "./sections/couple-section";
import { QuoteSection } from "./sections/quote-section";
import { StoriesSection } from "./sections/stories-section";
import { EventsSection } from "./sections/events-section";
import { GallerySection } from "./sections/gallery-section";
import { GiftsSection } from "./sections/gifts-section";
import { RsvpSection } from "./sections/rsvp-selection";
import { DressSection } from "./sections/dress-section";
import { ThemeSection } from "./sections/theme-section";
import { FontSection } from "./sections/font-section";
import { BackgroundSection } from "./sections/background-section";

const triggerClassName =
  "items-center justify-start gap-4 px-4 py-3 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0 hover:bg-muted";

const itemClassName = "border-none";

type Section = {
  value: string;
  label: string;
  Icon: LucideIcon;
  Content: React.ComponentType;
  contentClassName?: string;
};

const sections: Section[] = [
  { value: "basics", label: "Informasi Dasar", Icon: Info, Content: BasicsSection },
  { value: "couple", label: "Mempelai", Icon: Heart, Content: CoupleSection },
  { value: "quote", label: "Kutipan", Icon: Quote, Content: QuoteSection },
  { value: "events", label: "Acara", Icon: CalendarDays, Content: EventsSection },
  { value: "stories", label: "Cerita", Icon: BookHeart, Content: StoriesSection },
  { value: "gallery", label: "Galeri", Icon: Images, Content: GallerySection },
  { value: "gifts", label: "Hadiah", Icon: Gift, Content: GiftsSection },
  { value: "rsvp", label: "RSVP", Icon: MailCheck, Content: RsvpSection },
  { value: "dress", label: "Dress Code", Icon: Shirt, Content: DressSection },
  { value: "theme", label: "Tema Warna", Icon: Palette, Content: ThemeSection },
  { value: "font", label: "Tipografi", Icon: Type, Content: FontSection },
  {
    value: "background",
    label: "Latar Belakang",
    Icon: Wallpaper,
    Content: BackgroundSection,
  },
];

export function AccordionSection() {
  return (
    <>
      <TemplateSelectorSection />
      <Accordion type="multiple" defaultValue={["basics"]}>
        {sections.map(({ value, label, Icon, Content, contentClassName }) => (
          <AccordionItem key={value} value={value} className={itemClassName}>
            <AccordionTrigger className={triggerClassName}>
              <span className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                {label}
              </span>
            </AccordionTrigger>
            <AccordionContent className={contentClassName ?? "px-4 pb-4 h-auto!"}>
              <Content />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
