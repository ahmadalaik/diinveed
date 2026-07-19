import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFitScale(
  width: number,
  height: number,
  padding: number,
  maxScale = 1,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{
    w: number;
    h: number;
  } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  const scale = containerSize
    ? Math.max(
        0,
        Math.min(
          (containerSize.w - padding * 2) / width,
          (containerSize.h - padding * 2) / height,
          maxScale,
        ),
      )
    : maxScale;

  return { containerRef, scale };
}
