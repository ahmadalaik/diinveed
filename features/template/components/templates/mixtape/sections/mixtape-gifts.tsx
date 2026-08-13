import type { InvitationState } from "@/features/invitation/types/invitation.type";
import CopyButton from "../../shared/copy-button";
import { Grain } from "../motifs/grain";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeGiftsProps = { inv: InvitationState };

export function MixtapeGifts({ inv }: MixtapeGiftsProps) {
  if (!inv.gifts.enabled) return null;

  const hasContent =
    inv.gifts.transfers.length > 0 || inv.gifts.packages.length > 0;
  if (!hasContent) return null;

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: "var(--tpl-bg-tertiary)",
        color: "var(--tpl-text-primary)",
      }}
    >
      <MixtapeHeading thin="Hadiah untuk" bold="kedua mempelai" className="text-3xl" />

      <div className="relative z-10 mt-6 flex flex-col gap-5">
        {inv.gifts.transfers.map((transfer) => (
          <div key={transfer.id}>
            <p
              className="text-sm font-(family-name:--tpl-font-heading)"
              style={{ fontWeight: "var(--tpl-weight-heading)" }}
            >
              {transfer.provider}
            </p>
            <p className="font-(family-name:--tpl-font-body) text-lg tracking-wide">
              {transfer.accountNumber}
            </p>
            <p className="text-xs font-(family-name:--tpl-font-body)" style={{ opacity: 0.8 }}>
              a.n. {transfer.accountName}
            </p>
            <div className="mt-2">
              <CopyButton value={transfer.accountNumber} />
            </div>
          </div>
        ))}

        {inv.gifts.packages.map((pack) => (
          <div key={pack.id}>
            <p
              className="text-sm font-(family-name:--tpl-font-heading)"
              style={{ fontWeight: "var(--tpl-weight-heading)" }}
            >
              Kirim hadiah
            </p>
            <p className="font-(family-name:--tpl-font-body) text-sm">
              {pack.recipientName} · {pack.recipientPhoneNumber}
            </p>
            <p className="text-xs font-(family-name:--tpl-font-body)" style={{ opacity: 0.8 }}>
              {pack.address}
            </p>
          </div>
        ))}
      </div>

      <Grain tone="lite" />
    </section>
  );
}
