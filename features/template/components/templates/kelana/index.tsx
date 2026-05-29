"use client";

import { useState } from "react";
import EnvelopeKelana from "./envelope";
import type { TemplateProps } from "../types";

export default function KelanaTemplate({ invitation: _invitation }: TemplateProps) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative w-full">
      {!opened && <EnvelopeKelana onOpen={() => setOpened(true)} />}
      {opened && (
        <div className="min-h-svh w-full bg-stone-900 text-stone-100 flex items-center justify-center px-8 py-14 text-center">
          {/* Cover and remaining Kelana sections will land here in a follow-up. */}
          <p className="opacity-60 text-sm">Kelana content coming soon.</p>
        </div>
      )}
    </div>
  );
}
