import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { landingContent, marketingConfig } from "../config/landing-content";
import { buildMarketingWhatsappUrl } from "../lib/whatsapp-url";

export function LandingHero() {
  const whatsappUrl = buildMarketingWhatsappUrl(marketingConfig.whatsappNumber, {
    source: "hero",
  });

  return (
    <section
      aria-labelledby="landing-title"
      className="overflow-hidden bg-landing-pearl"
    >
      <div className="landing-container grid min-h-[46rem] items-stretch lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10 flex flex-col justify-center py-24 sm:py-28 lg:py-32">
          <p className="mb-6 max-w-max rounded-full border border-landing-ink/15 px-4 py-2 text-xs uppercase text-landing-ink/70">
            {landingContent.hero.eyebrow}
          </p>
          <h1
            id="landing-title"
            className="max-w-3xl font-landing-display text-5xl font-semibold leading-[1.02] text-landing-ink sm:text-6xl lg:text-7xl"
          >
            {landingContent.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-landing-ink/70">
            {landingContent.hero.description}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="landing-focus group rounded-full bg-landing-rose px-5 text-landing-paper hover:bg-landing-rose/90"
            >
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                {landingContent.hero.primaryCta}
                <span className="ml-3 inline-flex size-8 items-center justify-center rounded-full bg-landing-paper/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="landing-focus rounded-full border-landing-ink/20 bg-transparent px-6 text-landing-ink hover:bg-landing-ink hover:text-landing-paper"
            >
              <Link href="#template">{landingContent.hero.secondaryCta}</Link>
            </Button>
          </div>
          <p className="mt-8 max-w-md text-sm leading-6 text-landing-ink/60">
            {landingContent.offer.priceLabel}. {landingContent.offer.paymentLabel}.
            Aktif selama {landingContent.offer.activeMonths} bulan.
          </p>
        </div>
        <div className="relative min-h-[32rem] lg:min-h-full">
          <div className="absolute inset-y-10 left-0 right-[-18vw] overflow-hidden rounded-l-[3rem] bg-landing-ink shadow-[0_28px_80px_rgba(16,20,20,0.18)] lg:left-12">
            <Image
              src="/marketing/landing/diinveed-editorial-hero.png"
              alt="Komposisi editorial undangan pernikahan digital diinveed"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-landing-ink/10" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-landing-rose/95 [clip-path:polygon(0_0,68%_0,100%_100%,0_100%)]" />
            <div className="absolute bottom-0 left-0 h-1/3 w-1/2 bg-landing-rose/80 [clip-path:polygon(0_40%,100%_100%,0_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
