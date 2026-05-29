import type { ComponentType } from "react";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

export type TemplateProps = {
  invitation: InvitationState;
};

export type TemplateComponent = ComponentType<TemplateProps>;
