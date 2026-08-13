import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Doodle } from "../motifs/doodle";
import { Grain } from "../motifs/grain";

type MixtapeFooterProps = { inv: InvitationState };

export function MixtapeFooter({ inv }: MixtapeFooterProps) {
  const first = inv.isBrideFirst ? inv.brideNickname : inv.groomNickname;
  const second = inv.isBrideFirst ? inv.groomNickname : inv.brideNickname;

  return (
    <footer
      className="relative px-6 py-26 text-center"
      style={{
        backgroundColor: "var(--tpl-bg-secondary)",
        color: "var(--tpl-text-secondary)",
      }}
    >
      <Doodle variant="flower" className="left-[-7%] top-2 w-[30%]" />
      <p
        className="relative z-10 text-3xl font-(family-name:--tpl-font-heading)"
        style={{ fontWeight: "var(--tpl-weight-heading)" }}
      >
        {first} &amp; {second}
      </p>
      <p
        className="relative z-10 mt-2 text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]"
        style={{ opacity: 0.7 }}
      >
        Terima kasih
      </p>
      <Grain tone="dark" />
      <Doodle variant="burst" className="right-[-6%] bottom-2 w-[30%]" />
    </footer>
  );
}
