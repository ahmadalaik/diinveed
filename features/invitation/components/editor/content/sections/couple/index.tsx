"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
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
import { SceneCoupleImageField } from "./scene-couple-image-field";

export function CoupleSection() {
  const isBrideFirst = useInvitationStore((s) => s.isBrideFirst);
  const templateSlug = useInvitationStore((s) => s.templateSlug);
  const fieldSetClass = "gap-[13px] border-t py-[18px]";
  const fieldLegendClass = "mb-0 text-[11px] font-semibold leading-none";
  const fieldGroupClass = "gap-[13px]";

  if (!isBrideFirst) {
    return (
      <FieldGroup className="gap-0">
        <NameOrderField />
        <FieldSet className={fieldSetClass}>
          <FieldLegend className={fieldLegendClass}>Mempelai pria</FieldLegend>
          <FieldGroup className={fieldGroupClass}>
            <PhotoField
              label="Foto mempelai pria"
              imageKey="groomImage"
              keyProp="groomImageKey"
            />
            <GroomNameField />
            <GroomNicknameField />
            <GroomDescField />
          </FieldGroup>
        </FieldSet>
        <FieldSet className={fieldSetClass}>
          <FieldLegend className={fieldLegendClass}>Mempelai wanita</FieldLegend>
          <FieldGroup className={fieldGroupClass}>
            <PhotoField
              label="Foto mempelai wanita"
              imageKey="brideImage"
              keyProp="brideImageKey"
            />
            <BrideNameField />
            <BrideNicknameField />
            <BrideDescField />
          </FieldGroup>
        </FieldSet>
        {templateSlug === "taman-nusantara" ? <SceneCoupleImageField /> : null}
      </FieldGroup>
    );
  }

  return (
    <FieldGroup className="gap-0">
      <NameOrderField />
      <FieldSet className={fieldSetClass}>
        <FieldLegend className={fieldLegendClass}>Mempelai wanita</FieldLegend>
        <FieldGroup className={fieldGroupClass}>
          <PhotoField
            label="Foto mempelai wanita"
            imageKey="brideImage"
            keyProp="brideImageKey"
          />
          <BrideNameField />
          <BrideNicknameField />
          <BrideDescField />
        </FieldGroup>
      </FieldSet>
      <FieldSet className={fieldSetClass}>
        <FieldLegend className={fieldLegendClass}>Mempelai pria</FieldLegend>
        <FieldGroup className={fieldGroupClass}>
          <PhotoField
            label="Foto mempelai pria"
            imageKey="groomImage"
            keyProp="groomImageKey"
          />
          <GroomNameField />
          <GroomNicknameField />
          <GroomDescField />
        </FieldGroup>
      </FieldSet>
      {templateSlug === "taman-nusantara" ? <SceneCoupleImageField /> : null}
    </FieldGroup>
  );
}
