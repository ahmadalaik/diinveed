import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { landingContent } from "../config/landing-content";

export function LandingFaq() {
  return (
    <section id="faq" className="bg-landing-paper py-20 sm:py-28">
      <div className="landing-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <h2 className="font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
          Pertanyaan yang biasanya muncul sebelum chat admin.
        </h2>
        <Accordion type="single" collapsible className="border-t border-landing-ink/12">
          {landingContent.faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border-landing-ink/12"
            >
              <AccordionTrigger className="landing-focus py-6 text-base text-landing-ink hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-7 text-landing-ink/65">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
