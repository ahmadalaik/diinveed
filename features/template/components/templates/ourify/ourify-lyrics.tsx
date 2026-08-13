import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { buildOurifyHashtag } from "./ourify-data";
import { OURIFY_VERSE_SECTION_CLASS } from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

export function OurifyVerse({ invitation }: { invitation: InvitationState }) {
  if (!invitation.quote.trim()) return null;

  const hashtag =
    OURIFY_REVIEW_PLACEHOLDERS.hashtagOverride ||
    buildOurifyHashtag(invitation.brideNickname, invitation.groomNickname);

  return (
    <section
      data-ourify-section="verse"
      aria-labelledby="ourify-verse-title"
      className={`${OURIFY_VERSE_SECTION_CLASS} bg-(--ourify-verse) text-white`}
    >
      <h2 id="ourify-verse-title" className="sr-only">
        Verse
      </h2>
      <blockquote className="text-[27.2px] leading-[1.18] font-extrabold tracking-[-0.035em]">
        {invitation.quote}
      </blockquote>
      {invitation.quoteReference ? (
        <p className="mt-6 text-[13px] font-bold text-white/85">
          {invitation.quoteReference}
        </p>
      ) : null}
      <span className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-bold text-white">
        {hashtag}
      </span>
    </section>
  );
}
