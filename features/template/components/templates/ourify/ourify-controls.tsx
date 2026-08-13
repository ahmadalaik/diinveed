"use client";

import { Maximize2, Minimize2, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  OURIFY_REVIEW_PLACEHOLDERS,
  type OurifyReviewPalette,
} from "./ourify-review-placeholders";

type OurifyThemeSwitcherProps = {
  paletteId: OurifyReviewPalette["id"];
  onPaletteChange: (paletteId: OurifyReviewPalette["id"]) => void;
};

export function OurifyThemeSwitcher({
  paletteId,
  onPaletteChange,
}: OurifyThemeSwitcherProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[65] mx-auto h-0 w-full max-w-[480px]">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Pilih tema"
            className="pointer-events-auto absolute top-1 right-2 size-11 rounded-full bg-black/35 text-white backdrop-blur-md hover:bg-black/55 hover:text-white"
          >
            <Palette aria-hidden="true" className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-52 border-white/10 bg-[#282828] p-3 text-white"
        >
          <PopoverTitle className="text-xs font-bold text-white">
            Theme
          </PopoverTitle>
          <div className="mt-2 grid gap-1.5">
            {OURIFY_REVIEW_PLACEHOLDERS.palettes.map((palette) => (
              <Button
                key={palette.id}
                type="button"
                variant="ghost"
                aria-pressed={palette.id === paletteId}
                onClick={() => onPaletteChange(palette.id)}
                className="h-9 justify-start rounded-md px-2 text-white hover:bg-white/10 hover:text-white aria-pressed:bg-white/12"
              >
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border border-white/25"
                  style={{ backgroundColor: palette.accent }}
                />
                {palette.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function OurifyFullscreenControl({ available }: { available: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!available) return;

    const handleFullscreenChange = () => {
      setActive(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [available]);

  if (!available) return null;

  const handleToggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      return;
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[76px] z-[54] mx-auto h-0 w-full max-w-[480px]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={active ? "Keluar dari layar penuh" : "Aktifkan layar penuh"}
        onClick={() => void handleToggle()}
        className="pointer-events-auto absolute right-2 bottom-0 size-11 rounded-full bg-[#282828]/95 text-white shadow-lg hover:bg-[#333333] hover:text-white"
      >
        {active ? (
          <Minimize2 aria-hidden="true" className="size-5" />
        ) : (
          <Maximize2 aria-hidden="true" className="size-5" />
        )}
      </Button>
    </div>
  );
}
