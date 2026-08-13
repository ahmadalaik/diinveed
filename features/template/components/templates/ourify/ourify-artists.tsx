import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { getOrderedArtists } from "./ourify-data";
import { OurifyArtwork } from "./ourify-image";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifyReveal,
  OurifySectionHeading,
} from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

export function OurifyCouple({ invitation }: { invitation: InvitationState }) {
  const artists = getOrderedArtists(invitation);

  return (
    <section
      data-ourify-section="couple"
      aria-labelledby="ourify-couple-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-couple-title" eyebrow="Featuring">
        Bride &amp; Groom
      </OurifySectionHeading>

      <div className="mt-8 flex flex-col gap-5">
        {artists.map((artist, index) => {
          const isBride = artist.role === "Mempelai Wanita";
          const handle = isBride
            ? OURIFY_REVIEW_PLACEHOLDERS.socials.bride
            : OURIFY_REVIEW_PLACEHOLDERS.socials.groom;
          const displayRole = isBride ? "The Bride" : "The Groom";

          return (
            <OurifyReveal key={artist.role} delay={index * 0.06}>
              <Card
                data-artist={artist.nickname}
                role="article"
                className="gap-0 rounded-xl bg-[#181818] py-0 text-white shadow-none ring-0"
              >
                <div className="relative">
                  <OurifyArtwork
                    src={artist.image}
                    alt={`Potret ${artist.name}`}
                    fallbackLabel={`Artwork ${artist.role}`}
                    sizes="(max-width: 480px) calc(100vw - 40px), 440px"
                    className="aspect-[350/298] rounded-none"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[11px] font-bold tracking-[0.08em] text-white/75 uppercase">
                      {displayRole}
                    </p>
                    <h3 className="mt-1 text-[30px] leading-[0.96] font-black tracking-[-0.045em]">
                      {artist.name}
                    </h3>
                  </div>
                </div>
                <CardContent className="px-[18px] py-[18px]">
                  <p
                    data-artist-description
                    className="text-[13px] leading-5 text-[#b3b3b3]"
                  >
                    {artist.description || artist.name}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label={`Follow ${handle}`}
                    className="mt-4 h-8 rounded-full border-white/55 bg-transparent px-4 text-xs font-bold text-white hover:bg-white/10 hover:text-white"
                  >
                    Follow {handle}
                  </Button>
                </CardContent>
              </Card>
            </OurifyReveal>
          );
        })}
      </div>
    </section>
  );
}
