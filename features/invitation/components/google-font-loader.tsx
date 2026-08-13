"use client";

import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { useGoogleFonts } from "@/features/invitation/hooks/use-google-fonts";
import {
  getTemplateTokens,
  mergeTemplateTokenOverrides,
} from "@/features/template/tokens";

export function GoogleFontLoader({
  invitation,
}: {
  invitation: InvitationState;
}) {
  const tokens = mergeTemplateTokenOverrides(
    getTemplateTokens(invitation.templateSlug),
    invitation.tokenOverrides,
  );

  useGoogleFonts([
    tokens.typography.heading.family,
    tokens.typography.body.family,
  ]);

  return null;
}
