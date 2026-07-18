import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { TamanNusantaraPresets } from "../design/taman-nusantara-presets";
import {
  TypographyBodyField,
  TypographyHeadingField,
} from "./typography-field";

export function FontSection() {
  const templateSlug = useInvitationStore((state) => state.templateSlug);

  if (templateSlug === "taman-nusantara") {
    return <TamanNusantaraPresets kind="typography" />;
  }

  return (
    <div className="space-y-6 py-4">
      <TypographyHeadingField />
      <TypographyBodyField />
    </div>
  );
}
