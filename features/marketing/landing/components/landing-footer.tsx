import Link from "next/link";

import { marketingConfig } from "../config/landing-content";
import { buildMarketingWhatsappUrl } from "../lib/whatsapp-url";

export function LandingFooter() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildMarketingWhatsappUrl(marketingConfig.whatsappNumber, {
    source: "final-cta",
  });

  return (
    <footer className="bg-landing-paper py-10 text-landing-ink">
      <div className="landing-container flex flex-col gap-6 border-t border-landing-ink/12 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="landing-focus font-landing-display text-xl font-semibold">
            diinveed
          </Link>
          <p className="mt-2 text-sm text-landing-ink/60">
            © {year} diinveed. Undangan digital untuk cerita yang personal.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-landing-ink/65" aria-label="Footer">
          <Link className="landing-focus hover:text-landing-ink" href="#template">
            Template
          </Link>
          <Link className="landing-focus hover:text-landing-ink" href="#fitur">
            Fitur
          </Link>
          <Link className="landing-focus hover:text-landing-ink" href="#harga">
            Harga
          </Link>
          <a
            className="landing-focus hover:text-landing-ink"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  );
}
