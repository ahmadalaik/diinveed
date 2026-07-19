import {
  Gift,
  Images,
  MapPinned,
  MessageCircleHeart,
  Music,
  PenLine,
  Send,
  Sparkles,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

const stories = [
  {
    title: "Cerita kalian",
    body: "Bagian yang membuat undangan terasa punya jiwa, bukan sekadar tautan.",
    features: [
      { label: "Galeri", icon: Images },
      { label: "Cerita", icon: PenLine },
      { label: "Musik", icon: Music },
    ],
  },
  {
    title: "Membantu para tamu",
    body: "Informasi penting disusun agar tamu cepat menemukan detail yang mereka butuhkan.",
    features: [
      { label: "Detail acara", icon: Sparkles },
      { label: "Peta lokasi", icon: MapPinned },
    ],
  },
  {
    title: "Menjaga hari H",
    body: "Interaksi tamu tetap tertata sebelum hari pernikahan tiba.",
    features: [
      { label: "RSVP", icon: Send },
      { label: "Ucapan", icon: MessageCircleHeart },
      { label: "Hadiah digital", icon: Gift },
    ],
  },
] as const;

export function FeatureStories() {
  return (
    <section id="fitur" className="bg-landing-paper py-24 sm:py-32">
      <div className="landing-container">
        <h2 className="max-w-3xl font-landing-display text-4xl font-semibold leading-tight text-landing-ink sm:text-5xl">
          Fitur diceritakan sesuai momen, bukan dijejer seperti checklist SaaS.
        </h2>
        <div className="mt-14">
          {stories.map((story, index) => (
            <div key={story.title}>
              <article className="grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <h3 className="font-landing-display text-3xl font-semibold text-landing-ink">
                    {story.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-7 text-landing-ink/65">
                    {story.body}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {story.features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.label}
                        className="flex items-center gap-3 border-t border-landing-ink/12 py-4"
                      >
                        <Icon aria-hidden="true" className="text-landing-rose" />
                        <span className="text-landing-ink">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </article>
              {index < stories.length - 1 ? (
                <Separator className="bg-landing-ink/10" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
