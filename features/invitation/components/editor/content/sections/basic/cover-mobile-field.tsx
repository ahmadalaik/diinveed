"use client";

import { Smartphone } from "lucide-react";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField } from "../../../editor-field";
import { CoverImageUploadCard } from "./cover-image-upload-card";

export function CoverMobileImageField() {
  const coverMobileImage = useInvitationStore((s) => s.coverMobileImage);
  const coverMobileImageKey = useInvitationStore((s) => s.coverMobileImageKey);
  const errors = useInvitationStore((s) => s.publishErrors?.coverMobileImage);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField
      publishField="coverMobileImage"
      invalid={Boolean(errors?.length)}
    >
      <CoverImageUploadCard
        id="basics-cover-mobile-image"
        title="Mobile"
        variant="mobile"
        ratio="9:16"
        recommendedSize="1080 x 1920px"
        image={coverMobileImage}
        imageKey={coverMobileImageKey}
        errors={errors}
        icon={Smartphone}
        onValueChange={(url, key) =>
          set({ coverMobileImage: url, coverMobileImageKey: key })
        }
      />
    </EditorField>
  );
}
