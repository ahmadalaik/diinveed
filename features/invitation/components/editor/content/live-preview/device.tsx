import { RefObject, useEffect, useState } from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { useFitScale } from "@/features/invitation/hooks/use-fit-scale";
import { cn } from "@/lib/utils";

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;
const MOBILE_MAX_SCALE = 0.7;
const PADDING = 48;

export type DeviceType = "desktop" | "tablet" | "mobile";

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  device: DeviceType;
  snapshot: InvitationState;
}

export function Device({ iframeRef, device, snapshot }: Props) {
  const isDesktop = device === "desktop";

  const width = isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH;
  const height = isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT;
  const framePadding = isDesktop ? 10 : 12;
  const maxScale = isDesktop ? undefined : MOBILE_MAX_SCALE;

  const outerWidth = width + framePadding * 2;
  const outerHeight = height + framePadding * 2;

  const { containerRef, scale } = useFitScale(
    outerWidth,
    outerHeight,
    PADDING,
    maxScale,
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full overflow-hidden"
    >
      <div
        className="will-change-transform transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className={cn(
            "relative shadow-2xl bg-black transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isDesktop ? "rounded-[20px]" : "rounded-[45px]",
          )}
          style={{ width: outerWidth, height: outerHeight }}
        >
          <div
            className="absolute bg-white transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              top: framePadding,
              left: framePadding,
              width: width,
              height: height,
              clipPath: isDesktop
                ? "inset(0 round 10px)"
                : "inset(0 round 33px)",
              contain: isDesktop ? undefined : "paint",
            }}
          >
            <PreviewIframe
              key={snapshot.templateSlug}
              iframeRef={iframeRef}
              snapshot={snapshot}
            />
          </div>

          <div
            className={cn(
              "pointer-events-none absolute inset-0 transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]",
              isDesktop ? "rounded-[20px]" : "rounded-[45px]",
            )}
            style={{ boxShadow: `inset 0 0 0 ${framePadding}px black` }}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewIframe({ iframeRef, snapshot }: Omit<Props, "device">) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`/live-preview/${snapshot.templateSlug}`}
      onLoad={() => setLoaded(true)}
      className={cn(
        "w-full h-full border-0 transition-opacity duration-300 ease-out",
        loaded ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
