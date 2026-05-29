"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { Settings } from "lucide-react";
import { BasicsSection } from "./sections/basics-section";
import { TemplateSection } from "./sections/template-section";
import { TemplateSelectorSection } from "./sections/template-selector-section";
import { EventsSection } from "./sections/events-section";
import { LocationSection } from "./sections/location-section";
import { CoverSection } from "./sections/cover-section";
import { ThemeSection } from "./sections/theme-section";
import { FontSection } from "./sections/font-section";
import { BackgroundSection } from "./sections/background-section";
import { RsvpSection } from "./sections/rsvp-selection";
import { DressSection } from "./sections/dress-section";
import { StoriesSection } from "./sections/stories-section";
import { GallerySection } from "./sections/gallery-section";
import { GiftsSection } from "./sections/gifts-section";
import { StickersSection } from "./sections/stickers-section";

function SaveIndicator() {
  const saveStatus = useInvitationStore((s) => s.saveStatus);
  const lastSaved = useInvitationStore((s) => s.lastSaved);

  if (saveStatus === "saving")
    return <span className="text-xs">Saving...</span>;
  if (saveStatus === "saved" && lastSaved)
    return (
      <span className="text-xs text-muted-foreground">
        Auto-saved · just now
      </span>
    );
  if (saveStatus === "unsaved")
    return <span className="text-xs text-amber-500">Unsaved changes</span>;
  return null;
}

type Props = {
  onPublish: () => void;
};

export function EditorSidebar({ onPublish }: Props) {
  const title = useInvitationStore((s) => s.title);
  const isPublished = useInvitationStore((s) => s.isPublished);
  const set = useInvitationStore((s) => s.set);

  return (
    <aside className="flex h-full w-[25%] min-w-64 flex-col border-r bg-background">
      {/* Brand bar */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Invitation Studio</p>
          <p className="text-xs text-muted-foreground">Diinveed</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Title + save status */}
      <div className="border-b px-4 py-2 space-y-1">
        <Input
          value={title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Invitation title"
          className="border-none shadow-none px-0 text-sm font-medium focus-visible:ring-0"
        />
        <SaveIndicator />
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={["template"]}
          className="w-full"
        >
          <AccordionItem value="template">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Template
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Layout
                </p>
                <TemplateSelectorSection />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Theme
                </p>
                <TemplateSection />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="basics">
            <AccordionTrigger className="px-4 py-3 text-sm">
              The Basics
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <BasicsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="events">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Events
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <EventsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="location">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Location
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <LocationSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cover">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Cover Image
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <CoverSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="theme">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Color Theme
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ThemeSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="font">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Typography
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <FontSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="background">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Background
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <BackgroundSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rsvp">
            <AccordionTrigger className="px-4 py-3 text-sm">
              RSVP
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <RsvpSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dress">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Dress Code
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <DressSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stories">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Our Story
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <StoriesSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="gallery">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Gallery
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <GallerySection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="gifts">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Gifts
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <GiftsSection />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stickers">
            <AccordionTrigger className="px-4 py-3 text-sm">
              Decorative
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <StickersSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Sticky footer */}
      <div className="border-t px-4 py-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Preview
        </Button>
        <Button size="sm" className="flex-1" onClick={onPublish}>
          {isPublished ? "Published ✓" : "Publish"}
        </Button>
      </div>
    </aside>
  );
}
