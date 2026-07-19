import { Button } from "@/components/ui/button";
import { marketingConfig } from "../config/landing-content";
import { buildMarketingWhatsappUrl } from "../lib/whatsapp-url";

export function FinalCta() {
  const whatsappUrl = buildMarketingWhatsappUrl(marketingConfig.whatsappNumber, {
    source: "final-cta",
  });

  return (
    <section className="bg-landing-ink py-24 text-landing-paper sm:py-32">
      <div className="landing-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="max-w-4xl font-landing-display text-4xl font-semibold leading-tight sm:text-6xl">
            Kalau rasanya sudah cocok, mulai dari percakapan yang sederhana.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-landing-paper/70">
            Ceritakan kebutuhan kalian ke admin. Kami bantu arahkan template,
            pembayaran, dan penyiapan akun awal.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="landing-focus rounded-full bg-landing-rose px-7 text-landing-paper hover:bg-landing-rose/90"
        >
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            Diskusikan undangan kalian
          </a>
        </Button>
      </div>
    </section>
  );
}
