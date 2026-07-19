"use client";

import { usePreviewState } from "@/features/invitation/hooks/use-preview-state";
import { Laptop, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Device, DeviceType } from "./device";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export function LivePreview() {
  const snapshot = usePreviewState(800);
  const snapshotRef = useRef(snapshot);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceType>("mobile");

  //   send payload data when snapshot changes
  useEffect(() => {
    snapshotRef.current = snapshot;
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "invitation:update",
        payload: snapshot,
      },
      window.location.origin,
    );
  }, [snapshot]);

  //   send payload for first time after render
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;

      if (e.data?.type === "preview:ready") {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "invitation:update",
            payload: snapshotRef.current,
          },
          window.location.origin,
        );
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="w-full md:flex-1 h-full relative bg-[#f4f4f6] dark:bg-zinc-900 rounded-[1.25rem] sm:rounded-[1.75rem] border border-zinc-200/80 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Absolute Floating Device Switcher */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white border border-zinc-200/80 rounded-full p-1 shadow-xs flex items-center gap-1">
        {/* Single persistent sliding background pill */}
        <motion.div
          className="absolute top-1 bottom-1 bg-zinc-950 rounded-full shadow-xs pointer-events-none"
          initial={false}
          animate={{
            left: device === "mobile" ? "4px" : "calc(50% + 2px)",
            width: "calc(50% - 6px)",
          }}
          transition={{
            type: "spring",
            bounce: 0,
            stiffness: 200,
            damping: 25,
          }}
        />

        <button
          type="button"
          onClick={() => setDevice("mobile")}
          aria-label="Tampilan Mobile"
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none",
            device === "mobile"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-900",
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>

        <button
          type="button"
          onClick={() => setDevice("desktop")}
          aria-label="Tampilan Desktop"
          className={cn(
            "relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer select-none",
            device === "desktop"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-900",
          )}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>
      </div>

      {/* Real Device Frame Renderer */}
      <div className="w-full h-full flex items-center justify-center">
        <Device iframeRef={iframeRef} device={device} snapshot={snapshot} />
      </div>
    </main>
  );
}
