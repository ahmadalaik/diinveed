import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveReviewVideo } from "./ourify-data";
import { OurifyWaveMark } from "./ourify-image";
import { OURIFY_STANDARD_SECTION_CLASS } from "./ourify-motion";

export function OurifyVideo({
  configuredUrl,
}: {
  configuredUrl: string | null | undefined;
}) {
  const video = resolveReviewVideo(configuredUrl);

  return (
    <section
      data-ourify-section="video"
      aria-label="Wedding video"
      className={`${OURIFY_STANDARD_SECTION_CLASS} pt-0`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#181818]">
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--tpl-text-tertiary)_30%,transparent),transparent_45%),#181818]">
          <OurifyWaveMark className="size-20 text-(--tpl-text-tertiary)" />
        </div>
        <Button
          asChild
          size="icon"
          className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--tpl-text-tertiary) text-[#121212] hover:bg-(--tpl-text-tertiary)/90"
        >
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Putar video"
          >
            <Play
              aria-hidden="true"
              className="ml-1 size-6"
              fill="currentColor"
            />
          </a>
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-extrabold">{video.title}</h2>
          <p className="mt-1 text-[11px] text-[#b3b3b3]">
            Ourify Video Session
          </p>
        </div>
        <ExternalLink aria-hidden="true" className="size-4 text-[#b3b3b3]" />
      </div>
    </section>
  );
}
