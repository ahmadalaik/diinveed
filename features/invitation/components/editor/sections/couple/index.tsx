"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { FieldGroup } from "@/components/ui/field";
import { NameOrderField } from "./name-order-field";
import { PhotoField } from "./photo-field";
import {
  GroomDescField,
  GroomNameField,
  GroomNicknameField,
} from "./groom-field";
import {
  BrideDescField,
  BrideNameField,
  BrideNicknameField,
} from "./bride-field";

export function CoupleSection() {
  const isBrideFirst = useInvitationStore((s) => s.isBrideFirst);

  if (!isBrideFirst) {
    return (
      <FieldGroup className="gap-3">
        <NameOrderField />
        <PhotoField
          label="Foto Mempelai Pria"
          imageKey="groomImage"
          keyProp="groomImageKey"
        />
        <GroomNameField />
        <GroomNicknameField />
        <GroomDescField />
        <PhotoField
          label="Foto Mempelai Wanita"
          imageKey="brideImage"
          keyProp="brideImageKey"
        />
        <BrideNameField />
        <BrideNicknameField />
        <BrideDescField />
      </FieldGroup>
    );
  }

  return (
    <FieldGroup className="gap-3">
      <NameOrderField />
      <PhotoField
        label="Foto Mempelai Wanita"
        imageKey="brideImage"
        keyProp="brideImageKey"
      />
      <BrideNameField />
      <BrideNicknameField />
      <BrideDescField />
      <PhotoField
        label="Foto Mempelai Pria"
        imageKey="groomImage"
        keyProp="groomImageKey"
      />
      <GroomNameField />
      <GroomNicknameField />
      <GroomDescField />
    </FieldGroup>
  );
}
