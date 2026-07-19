"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATE_LABELS: Record<string, string> = {
  kalandra: "Kalandra",
  dikara: "Dikara",
  pradipta: "Pradipta",
  "wind-rises": "Wind Rises",
};

const TEMPLATE_THUMBNAILS: Partial<Record<string, string>> = {
  
};

export function templateLabel(slug: string) {
  return TEMPLATE_LABELS[slug] ?? slug;
}

function TemplateThumbnail({ slug }: { slug: string }) {
  const source = TEMPLATE_THUMBNAILS[slug];

  if (source) {
    return (
      <Image
        src={source}
        alt=""
        fill
        sizes="(min-width: 640px) 180px, 50vw"
        className="object-cover"
      />
    );
  }

  return (
    <iframe
      src={`/preview/${slug}`}
      title={`Preview ${templateLabel(slug)}`}
      loading="lazy"
      tabIndex={-1}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-[320%] w-[320%] origin-top-left scale-[0.3125] border-0"
    />
  );
}

type TemplatePickerProps = {
  value: string;
  slugs: readonly string[];
  onSelect: (slug: string) => void;
};

export function TemplatePicker({
  value,
  slugs,
  onSelect,
}: TemplatePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Template undangan"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {slugs.map((slug) => {
        const selected = slug === value;

        return (
          <button
            key={slug}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={templateLabel(slug)}
            onClick={() => onSelect(slug)}
            className={cn(
              "relative isolate aspect-3/4 overflow-hidden rounded-lg border bg-card text-card-foreground",
              "outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "border-primary"
                : "border-border hover:border-foreground/30",
            )}
          >
            <TemplateThumbnail slug={slug} />
            <span
              className="absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/5 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute inset-x-3 bottom-3 text-left text-xs font-medium text-background">
              {templateLabel(slug)}
            </span>
            {selected ? (
              <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-background text-foreground shadow-xs">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
