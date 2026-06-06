"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export function AccordionSection() {
  return (
    <Accordion type="multiple" defaultValue={["template"]}>
      <AccordionItem value="template" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Template
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <TemplateSelectorSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="basics" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Informasi Dasar
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <BasicsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="couple" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Mempelai
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <CoupleSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="quote" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Kutipan
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <QuoteSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="events" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>Acara</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <EventsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stories" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>Cerita</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <StoriesSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gallery" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>Galeri</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <GallerySection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gifts" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>Hadiah</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <GiftsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="rsvp" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>RSVP</AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <RsvpSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dress" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Dress Code
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <DressSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="theme" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Tema Warna
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <ThemeSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="font" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Tipografi
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <FontSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="background" className={itemClassName}>
        <AccordionTrigger className={triggerClassName}>
          Latar Belakang
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <BackgroundSection />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
