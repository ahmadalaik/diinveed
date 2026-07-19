"use client";

import { useEffect, useState } from "react";
import { TEMPLATES, DEFAULT_TEMPLATE_SLUG } from "@/features/template/registry/templates";
import type { InvitationState } from "@/features/invitation/types/invitation.type";

interface LivePreviewClientProps {
  templateSlug: string;
}

export function LivePreviewClient({ templateSlug }: LivePreviewClientProps) {
  const [invitation, setInvitation] = useState<InvitationState | null>(null);

  useEffect(() => {
    let received = false;

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "invitation:update") {
        received = true;
        setInvitation(e.data.payload as InvitationState);
      }
    }
    window.addEventListener("message", onMessage);

    const ping = () =>
      window.parent.postMessage(
        { type: "preview:ready" },
        window.location.origin,
      );

    ping();
    const interval = setInterval(() => {
      if (received) {
        clearInterval(interval);
        return;
      }
      ping();
    }, 200);
    const stop = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      window.removeEventListener("message", onMessage);
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const prevColorScheme = html.style.colorScheme;
    const prevBackground = html.style.background;
    html.style.colorScheme = "dark";
    html.style.background = "#000";
    return () => {
      html.style.colorScheme = prevColorScheme;
      html.style.background = prevBackground;
    };
  }, []);

  if (!invitation) {
    return <div className="min-h-screen bg-black" data-testid="live-preview-loader" />;
  }

  const SelectedTemplate = TEMPLATES[templateSlug] || TEMPLATES[DEFAULT_TEMPLATE_SLUG];

  return (
    <div className="min-h-screen bg-black text-foreground">
      <SelectedTemplate invitation={invitation} mode="preview" />
    </div>
  );
}
