"use client";

import { Monitor } from "lucide-react";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField } from "../../../editor-field";
import { CoverImageUploadCard } from "./cover-image-upload-card";

export function CoverDesktopImageField() {
  const coverDesktopImage = useInvitationStore((s) => s.coverDesktopImage);
  const coverDesktopImageKey = useInvitationStore(
    (s) => s.coverDesktopImageKey,
  );
  const errors = useInvitationStore((s) => s.publishErrors?.coverDesktopImage);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField
      publishField="coverDesktopImage"
      invalid={Boolean(errors?.length)}
    >
      <CoverImageUploadCard
        id="basics-cover-desktop-image"
        title="Desktop"
        variant="desktop"
        ratio="16:9"
        recommendedSize="1920 x 1080px"
        image={coverDesktopImage}
        imageKey={coverDesktopImageKey}
        errors={errors}
        icon={Monitor}
        onValueChange={(url, key) =>
          set({ coverDesktopImage: url, coverDesktopImageKey: key })
        }
      />
    </EditorField>
  );
}
