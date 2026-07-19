import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingContent, marketingConfig } from "../config/landing-content";
import { buildMarketingWhatsappUrl } from "../lib/whatsapp-url";

const navItems = [
  { href: "#template", label: "Template" },
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-pesan", label: "Cara pesan" },
  { href: "#harga", label: "Harga" },
] as const;

export function LandingNavbar() {
  const whatsappUrl = buildMarketingWhatsappUrl(marketingConfig.whatsappNumber, {
    source: "hero",
  });

  return (
    <header className="sticky top-0 z-40 border-b border-landing-ink/10 bg-landing-paper/90 backdrop-blur-md">
      <div className="landing-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="landing-focus font-landing-display text-xl font-semibold text-landing-ink"
        >
          diinveed
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Utama">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="landing-focus text-sm text-landing-ink/70 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-landing-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="landing-focus hidden rounded-full border-landing-ink/15 bg-transparent px-4 text-landing-ink hover:bg-landing-ink hover:text-landing-paper sm:inline-flex"
          >
            <Link href="#template">{landingContent.hero.secondaryCta}</Link>
          </Button>
          <Button
            asChild
            className="landing-focus rounded-full bg-landing-rose px-5 text-landing-paper hover:bg-landing-rose/90"
          >
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
