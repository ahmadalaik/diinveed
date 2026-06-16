import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;

const MOBILE_MAX_SCALE = 0.80;
const PADDING = 48;

export type DeviceType = "desktop" | "tablet" | "mobile";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Props {
  iframeRef: RefObject<HTMLIFrameElement | null>;
  device: DeviceType;
  snapshot: InvitationState;
}

function useFitScale(
  width: number,
  height: number,
  padding: number,
  maxScale = 1,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxScale);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const availW = el.clientWidth - padding * 2;
      const availH = el.clientHeight - padding * 2;
      const next = Math.min(availW / width, availH / height, maxScale);
      setScale(next > 0 ? next : maxScale);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, padding, maxScale]);

  return { containerRef, scale };
}

export function Device({ iframeRef, device, snapshot }: Props) {
  if (device === "desktop") {
    return <DesktopDevice iframeRef={iframeRef} snapshot={snapshot} />;
  }

  return <MobileDevice iframeRef={iframeRef} snapshot={snapshot} />;
}

function PreviewIframe({
  iframeRef,
  snapshot,
}: Omit<Props, "device">) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`/preview?template=${snapshot.templateSlug}`}
      onLoad={() => setLoaded(true)}
      className={cn(
        "w-full h-full border-0 transition-opacity duration-300 ease-out",
        loaded ? "opacity-100" : "opacity-0",
      )}
    />
  );
}

function DesktopDevice({ iframeRef, snapshot }: Omit<Props, "device">) {
  const { containerRef, scale } = useFitScale(
    DESKTOP_WIDTH,
    DESKTOP_HEIGHT,
    PADDING,
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full overflow-hidden"
    >
      {/* Skala-fit diterapkan instan (tanpa transisi) agar tidak ada efek
          zoom-maju saat mount/ganti device. */}
      <div style={{ transform: `scale(${scale})` }} className="will-change-transform">
        {/* Animasi perpindahan device: melebar kiri-kanan, bukan zoom uniform. */}
        <div className="relative bg-black shadow-2xl p-2.5 rounded-[20px] animate-[device-switch-x_0.28s_ease-out]">
          <div
            style={{ width: DESKTOP_WIDTH, height: DESKTOP_HEIGHT }}
            className="rounded-[12px] bg-black overflow-hidden"
          >
            <PreviewIframe
              key={snapshot.templateSlug}
              iframeRef={iframeRef}
              snapshot={snapshot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDevice({ iframeRef, snapshot }: Omit<Props, "device">) {
  const { containerRef, scale } = useFitScale(
    MOBILE_WIDTH,
    MOBILE_HEIGHT,
    PADDING,
    MOBILE_MAX_SCALE,
  );

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full overflow-hidden"
    >
      {/* Skala-fit diterapkan instan (tanpa transisi) agar tidak ada efek
          zoom-maju saat mount/ganti device. */}
      <div style={{ transform: `scale(${scale})` }} className="will-change-transform">
        {/* Animasi perpindahan device: melebar kiri-kanan, bukan zoom uniform. */}
        <div className="relative bg-black shadow-2xl p-2.5 rounded-[45px] animate-[device-switch-x_0.28s_ease-out]">
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-30 h-7 bg-black rounded-b-2xl z-10" />

          <div
            style={{ width: MOBILE_WIDTH, height: MOBILE_HEIGHT }}
            className="rounded-[35px] bg-black overflow-hidden"
          >
            <PreviewIframe
              key={snapshot.templateSlug}
              iframeRef={iframeRef}
              snapshot={snapshot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
