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
  const [scale, setScale] = useState(maxScale);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const availableW = el.clientWidth - padding * 2;
      const availableH = el.clientHeight - padding * 2;
      const next = Math.min(availableW / width, availableH / height, maxScale);
      setScale(next > 0 ? next : maxScale);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [width, height, padding, maxScale]);

  return { containerRef, scale };
}
