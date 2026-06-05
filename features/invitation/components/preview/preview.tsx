"use client";

import { useEffect, useRef, useState } from "react";
import { usePreviewState } from "@/features/invitation/hooks/use-preview-state";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Monitor, Smartphone } from "lucide-react";
import { Device, type DeviceType } from "./device";

export function Preview() {
  const snapshot = usePreviewState(500);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [device, setDevice] = useState<DeviceType>("mobile");

  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "invitation:update", payload: snapshot },
      window.location.origin,
    );
  }, [snapshot]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "preview:ready") {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "invitation:update", payload: snapshotRef.current },
          window.location.origin,
        );
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="flex-1 bg-muted/30 relative h-full overflow-hidden">
      <ToggleGroup
        className="absolute top-4 right-4 z-10"
        type="single"
        value={device}
        onValueChange={(value) => {
          if (value) setDevice(value as DeviceType);
        }}
      >
        <ToggleGroupItem value="desktop">
          <Monitor className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="mobile">
          <Smartphone className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Device iframeRef={iframeRef} device={device} snapshot={snapshot} />
    </div>
  );
}
