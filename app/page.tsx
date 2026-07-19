import type { Metadata } from "next";

import { AssistedSetup } from "@/features/marketing/landing/components/assisted-setup";
import { FeatureStories } from "@/features/marketing/landing/components/feature-stories";
import { FinalCta } from "@/features/marketing/landing/components/final-cta";
import { LandingFaq } from "@/features/marketing/landing/components/landing-faq";
import { LandingFooter } from "@/features/marketing/landing/components/landing-footer";
import { LandingHero } from "@/features/marketing/landing/components/landing-hero";
import { LandingNavbar } from "@/features/marketing/landing/components/landing-navbar";
import { OrderFlow } from "@/features/marketing/landing/components/order-flow";
import { ProductExperience } from "@/features/marketing/landing/components/product-experience";
import { SinglePricing } from "@/features/marketing/landing/components/single-pricing";
import { TemplateShowcase } from "@/features/marketing/landing/components/template-showcase";
import { SmoothScroll } from "@/features/marketing/landing/components/smooth-scroll";

export const metadata: Metadata = {
  title: "diinveed — Undangan Pernikahan Digital yang Personal",
  description:
    "Abadikan cerita kalian dalam undangan digital yang indah. Satu paket lengkap, editor mandiri, dan bantuan pengisian konten awal.",
};

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-landing-paper font-landing-body text-landing-ink">
        <LandingNavbar />
        <main>
          <LandingHero />
          <TemplateShowcase />
          <AssistedSetup />
          <ProductExperience />
          <FeatureStories />
          <OrderFlow />
          <SinglePricing />
          <LandingFaq />
          <FinalCta />
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}
