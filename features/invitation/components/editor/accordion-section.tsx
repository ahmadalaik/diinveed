"use client";

import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useInvitationStore } from "../../store/invitation-store";
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
  /** Publish-validation field keys that belong to this section. */
  fields?: string[];
};

const sections: Section[] = [
  {
    value: "basics",
    label: "Informasi Dasar",
    Icon: Info,
    Content: BasicsSection,
    fields: ["coverImage", "music", "title", "slug"],
  },
  {
    value: "couple",
    label: "Mempelai",
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
    label: "Kutipan",
    Icon: Quote,
    Content: QuoteSection,
    fields: ["quote", "quoteReference"],
  },
  {
    value: "events",
    label: "Acara",
    Icon: CalendarDays,
    Content: EventsSection,
    fields: ["events"],
  },
  {
    value: "stories",
    label: "Cerita",
    Icon: BookHeart,
    Content: StoriesSection,
    fields: ["stories"],
  },
  {
    value: "gallery",
    label: "Galeri",
    Icon: Images,
    Content: GallerySection,
    fields: ["gallery"],
  },
  {
    value: "gifts",
    label: "Hadiah",
    Icon: Gift,
    Content: GiftsSection,
    fields: ["gifts"],
  },
  {
    value: "rsvp",
    label: "RSVP",
    Icon: MailCheck,
    Content: RsvpSection,
    fields: ["rsvpDeadline", "rsvpOptions"],
  },
  { value: "theme", label: "Tema Warna", Icon: Palette, Content: ThemeSection },
  { value: "font", label: "Tipografi", Icon: Type, Content: FontSection },
  {
    value: "background",
    label: "Latar Belakang",
    Icon: Wallpaper,
    Content: BackgroundSection,
    fields: ["backgroundType"],
  },
];

export function AccordionSection() {
  const publishErrors = useInvitationStore((s) => s.publishErrors);
  const [value, setValue] = useState<string[]>(["basics"]);
  const [seenErrors, setSeenErrors] = useState(publishErrors);

  const errorSections = useMemo(() => {
    if (!publishErrors) return new Set<string>();
    return new Set(
      sections
        .filter((s) => s.fields?.some((f) => publishErrors[f]?.length))
        .map((s) => s.value),
    );
  }, [publishErrors]);

  // When a new set of publish errors arrives, open the sections that have one
  // without collapsing the rest. Adjusting state during render (instead of in
  // an effect) avoids the cascading re-render lint flags and is React-endorsed.
  if (publishErrors !== seenErrors) {
    setSeenErrors(publishErrors);
    if (errorSections.size > 0) {
      setValue((prev) => Array.from(new Set([...prev, ...errorSections])));
    }
  }

  return (
    <>
      <TemplateSelectorSection />
      <Accordion type="multiple" value={value} onValueChange={setValue}>
        {sections.map(({ value, label, Icon, Content, contentClassName }) => (
          <AccordionItem key={value} value={value} className={itemClassName}>
            <AccordionTrigger className={triggerClassName}>
              <span className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                {label}
                {errorSections.has(value) && (
                  <span
                    aria-label="Ada isian yang belum lengkap"
                    className="size-1.5 shrink-0 rounded-full bg-destructive"
                  />
                )}
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
