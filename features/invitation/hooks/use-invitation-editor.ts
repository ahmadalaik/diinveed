"use client";

import { useEffect, useRef } from "react";
import { useInvitationStore } from "../store/invitation-store";
import {
  applyTokens,
  getToken,
  mergeTokenOverrides,
} from "@/features/template/tokens";

export function useInvitationEditor() {
  const cardRef = useRef<HTMLDivElement>(null);
  const tokenId = useInvitationStore((s) => s.tokenId);
  const tokenOverrides = useInvitationStore((s) => s.tokenOverrides);

  useEffect(() => {
    if (!cardRef.current) return;

    const token = getToken(tokenId);
    if (!token) return;

    const merged = mergeTokenOverrides(token, tokenOverrides);
    applyTokens(merged, cardRef.current);
  }, [tokenId, tokenOverrides]);

  return { cardRef };
}
