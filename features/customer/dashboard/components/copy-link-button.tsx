"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  className?: string;
  path: string;
}

/** Salin URL absolut (origin + path) ke clipboard. */
export function CopyLinkButton({ className, path }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
    } catch {
      // clipboard tidak tersedia (mis. non-HTTPS); tidak ada yang perlu dilakukan
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={copy}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Tersalin" : "Salin link"}
    </Button>
  );
}
