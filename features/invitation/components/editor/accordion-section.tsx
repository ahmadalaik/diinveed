"use client";

import { useMemo, useState } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { useInvitationStore } from "../../store/invitation-store";
import {
  BookHeart,
  CalendarDays,
  ChevronRight,
  Gift,
  Heart,
  Images,
  Info,
  MailCheck,
  Palette,
  Quote,
  Type,
  type LucideIcon,
} from "lucide-react";
import { TemplateSelectorSection } from "./sections/template-selector-section";
import { BasicsSection } from "./sections/basic";
import { CoupleSection } from "./sections/couple";
import { QuoteSection } from "./sections/quote";
import { StoriesSection } from "./sections/story";
import { EventsSection } from "./sections/event";
import { GallerySection } from "./sections/gallery";
import { GiftsSection } from "./sections/gift";
import { RsvpSection } from "./sections/rsvp";
import { FontSection } from "./sections/typography";
import { ColorSection } from "./sections/color";

type Section = {
  value: string;
  label: string;
  Icon: LucideIcon;
  Content: React.ComponentType;
  contentClassName?: string;
  /** Publish-validation field keys that belong to this section. */
  fields?: string[];
};

const SECTIONS: Section[] = [
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
  { value: "color", label: "Warna", Icon: Palette, Content: ColorSection },
  { value: "font", label: "Tipografi", Icon: Type, Content: FontSection },
];

export function AccordionSection() {
  const publishErrors = useInvitationStore((s) => s.publishErrors);
  const [value, setValue] = useState<string[]>(["basics"]);
  const [seenErrors, setSeenErrors] = useState(publishErrors);

  const errorSections = useMemo(() => {
    if (!publishErrors) return new Set<string>();
    return new Set(
      SECTIONS
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
      <Accordion
        type="multiple"
        className="gap-2.5"
        value={value}
        onValueChange={setValue}
      >
        {SECTIONS.map(({ value, label, Icon, Content, contentClassName }) => (
          <AccordionItem
            key={value}
            value={value}
            className="rounded-lg border bg-card py-1 mx-4 first:mt-3 last:mb-3"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-start gap-4 rounded-lg border border-transparent px-4 py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200 in-data-open:rotate-90" />
                <span className="flex items-center gap-2 *:[svg]:text-muted-foreground">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  {label}
                  {errorSections.has(value) && (
                    <span
                      aria-label="Ada isian yang belum lengkap"
                      className="size-1.5 shrink-0 rounded-full bg-destructive"
                    />
                  )}
                </span>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent
              className={contentClassName ?? "px-6 pb-4 h-auto!"}
            >
              <Content />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
