import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Grain } from "../motifs/grain";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeDressCodeProps = { inv: InvitationState };

export function MixtapeDressCode({ inv }: MixtapeDressCodeProps) {
  if (!inv.dressCode.enabled) return null;

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: "var(--tpl-bg-primary)",
        color: "var(--tpl-text-primary)",
      }}
    >
      <MixtapeHeading thin="Dress" bold="code" className="text-3xl" />

      {inv.dressCode.description ? (
        <p className="relative z-10 mt-3 text-sm font-(family-name:--tpl-font-body)">
          {inv.dressCode.description}
        </p>
      ) : null}

      {inv.dressCode.colors.length > 0 ? (
        <ul className="relative z-10 mt-4 flex gap-2">
          {inv.dressCode.colors.map((color) => (
            <li
              key={color}
              className="h-9 w-9 rounded-full border border-current"
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </ul>
      ) : null}

      <Grain tone="lite" />
    </section>
  );
}
