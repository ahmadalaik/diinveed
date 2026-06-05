"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TemplateSelectorSection } from "./sections/template-selector-section";
import { CoupleSection } from "./sections/couple-section";
import { EventsSection } from "./sections/events-section";
import { StoriesSection } from "./sections/stories-section";
import { GiftsSection } from "./sections/gifts-section";
import { GallerySection } from "./sections/gallery-section";

export function AccordionSection() {
  return (
    <Accordion type="multiple" defaultValue={["template"]}>
      <AccordionItem value="template">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Template
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <TemplateSelectorSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="couple">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Mempelai
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <CoupleSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="events">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Acara
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <EventsSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="stories">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Cerita
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <StoriesSection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gallery">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Galeri
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <GallerySection />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gifts">
        <AccordionTrigger className="items-center justify-start gap-4 px-4 **:data-[slot=accordion-trigger-icon]:order-first **:data-[slot=accordion-trigger-icon]:ml-0">
          Hadiah
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 h-auto!">
          <GiftsSection />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
