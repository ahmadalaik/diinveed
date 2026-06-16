import { FieldGroup } from "@/components/ui/field";
import { InvitationUrlSection } from "../invitation-url-section";
import { MusicField } from "./music-field";
import { CoverDesktopImageField } from "./cover-desktop-field";
import { CoverMobileImageField } from "./cover-mobile-field";

export function BasicsSection() {
  return (
    <FieldGroup className="gap-3">
      <CoverDesktopImageField />
      <CoverMobileImageField />
      <MusicField />
      <InvitationUrlSection />
    </FieldGroup>
  );
}
