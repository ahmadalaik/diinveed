"use client";

import { Accordion } from "@/components/ui/accordion";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TamanNusantaraPresets } from "../design/taman-nusantara-presets";
import {
  ColorBackgroundField,
  ColorButtonField,
  ColorTextField,
} from "./color-field";

export function ColorSection() {
  const templateSlug = useInvitationStore((state) => state.templateSlug);

  if (templateSlug === "taman-nusantara") {
    return <TamanNusantaraPresets kind="palette" />;
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["text", "button", "background"]}
    >
      <ColorBackgroundField />
      <ColorTextField />
      <ColorButtonField />
    </Accordion>
  );
}
