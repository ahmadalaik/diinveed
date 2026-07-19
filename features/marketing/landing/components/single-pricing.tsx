import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { landingContent, marketingConfig } from "../config/landing-content";
import { buildMarketingWhatsappUrl } from "../lib/whatsapp-url";

export function SinglePricing() {
  const whatsappUrl = buildMarketingWhatsappUrl(marketingConfig.whatsappNumber, {
    source: "pricing",
  });

  return (
    <section id="harga" className="bg-landing-paper py-24 sm:py-32">
      <div className="landing-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
            Satu paket, satu harga, tidak dibuat pelit-pelit.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-landing-ink/65">
            Untuk fase awal produk, pilihan dibuat sederhana: semua kebutuhan
            utama undangan masuk ke Paket Lengkap.
          </p>
        </div>
        <Card className="rounded-[2rem] border-landing-ink/10 bg-landing-pearl p-2 shadow-none ring-1 ring-landing-ink/10">
          <div className="rounded-[1.55rem] bg-landing-paper p-6 sm:p-8">
            <CardHeader className="px-0">
              <CardTitle className="font-landing-display text-3xl text-landing-ink">
                {landingContent.offer.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <p className="font-landing-display text-6xl font-semibold text-landing-ink">
                {landingContent.offer.priceLabel}
              </p>
              <p className="mt-3 text-landing-ink/65">
                {landingContent.offer.paymentLabel}. Aktif selama{" "}
                {landingContent.offer.activeMonths} bulan.
              </p>
              <ul className="mt-8 grid gap-4">
                {landingContent.offer.inclusions.map((item) => (
                  <li key={item} className="flex gap-3 text-landing-ink">
                    <Check aria-hidden="true" className="mt-1 text-landing-rose" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-0 pb-0 pt-8">
              <Button
                asChild
                size="lg"
                className="landing-focus w-full rounded-full bg-landing-rose text-landing-paper hover:bg-landing-rose/90"
              >
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  Pesan Paket Lengkap
                </a>
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    </section>
  );
}
