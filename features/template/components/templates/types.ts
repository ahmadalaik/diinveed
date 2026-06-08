import type { ComponentType } from "react";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

export type TemplateMode = "preview" | "guest";

export type TemplateProps = {
  invitation: InvitationState;
  mode?: TemplateMode;
  guestSlug?: string;
  guestName?: string;
};

export type TemplateComponent = ComponentType<TemplateProps>;
