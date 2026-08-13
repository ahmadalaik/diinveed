import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Grain } from "../motifs/grain";
import { MixtapeHeading } from "../motifs/heading";
import { MixtapePill } from "../motifs/pill";

type MixtapeLivestreamProps = { inv: InvitationState };

export function MixtapeLivestream({ inv }: MixtapeLivestreamProps) {
  if (!inv.livestreamUrl) return null;

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: "var(--tpl-bg-secondary)",
        color: "var(--tpl-text-secondary)",
      }}
    >
      <MixtapeHeading thin="Hadir" bold="dari jauh" className="text-3xl" />
      <a
        href={inv.livestreamUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mt-4 inline-block"
      >
        <MixtapePill>Tonton siaran langsung</MixtapePill>
      </a>
      <Grain tone="dark" />
    </section>
  );
}
