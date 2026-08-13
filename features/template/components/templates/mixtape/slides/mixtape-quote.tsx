import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Doodle } from "../motifs/doodle";

type MixtapeQuoteProps = { inv: InvitationState };

export function MixtapeQuote({ inv }: MixtapeQuoteProps) {
  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <Doodle variant="burst" className="left-[6%] top-[16%] w-[40%]" />

      <blockquote
        className="text-lg leading-normal font-(family-name:--tpl-font-body)"
        style={{ fontWeight: "var(--mixtape-heading-thin)" }}
      >
        {inv.quote}
      </blockquote>

      {inv.quoteReference ? (
        <cite
          className="mt-4 block text-sm not-italic font-(family-name:--tpl-font-heading) uppercase tracking-[0.17em]"
          style={{
            color: "var(--tpl-text-secondary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          {inv.quoteReference}
        </cite>
      ) : null}

      <span
        className="absolute bottom-[5%] right-6 font-(family-name:--tpl-font-body)"
        style={{
          color: "var(--tpl-text-tertiary)",
          fontWeight: "var(--tpl-weight-heading)",
        }}
      >
        #
        {inv.isBrideFirst
          ? `${inv.brideNickname}${inv.groomNickname}`
          : `${inv.groomNickname}${inv.brideNickname}`}
      </span>
    </section>
  );
}
