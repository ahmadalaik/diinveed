import { FieldGroup } from "@/components/ui/field";
import { InvitationUrlSection } from "../invitation-url-section";
import { MusicField } from "./music-field";
import { CoverDesktopImageField } from "./cover-desktop-field";
import { CoverMobileImageField } from "./cover-mobile-field";
import { EditorField, EditorLabel } from "../../../editor-field";

export function BasicsSection() {
  return (
    <FieldGroup className="py-4">
      <EditorField>
        <EditorLabel>Cover Undangan</EditorLabel>
      </EditorField>
      <CoverDesktopImageField />
      <CoverMobileImageField />
      <MusicField />
      <InvitationUrlSection />
    </FieldGroup>
  );
}
