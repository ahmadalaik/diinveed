"use client";

import { useState } from "react";
import { useInvitationStore } from "../store/invitation-store";
import { EditorInitialData } from "../types/invitation.type";

// Hydrate the store synchronously during the first render (before children
// read it), so the preview snapshot captures real data immediately instead of
// relying on a post-mount effect + store subscription — a notification that
// gets swallowed by StrictMode's double-invoked effects, leaving the preview
// blank. The useState initializer runs once on mount, during render; the
// setState is idempotent so StrictMode's double invocation is harmless.
export function useHydrateInvitationStore(initialData: EditorInitialData) {
  useState(() => {
    useInvitationStore.setState({ ...initialData });
    return null;
  });
}
