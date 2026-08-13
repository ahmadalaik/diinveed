import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { daysTogether, daysUntilFirstEvent } from "../lib/stats";
import { Checkerboard } from "../motifs/checkerboard";
import { Doodle } from "../motifs/doodle";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeDaysProps = {
  inv: InvitationState;
  now: Date;
};

export function MixtapeDays({ inv, now }: MixtapeDaysProps) {
  const together = daysTogether(inv.relationshipStartDate ?? "", now);
  const countdown = daysUntilFirstEvent(inv.events, now);

  const value = together ?? countdown;
  if (value === null) return null;

  const isTogether = together !== null;

  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <Doodle variant="flower" className="left-[-14%] top-0 w-[86%]" />

      {/*
        Judul dan angka sengaja dipisah: angka raksasa adalah pusat visual
        slide ini, jadi kalimatnya harus utuh tanpa angka di tengahnya.
        Satuan ("hari" / "hari lagi") duduk tepat di bawah angka.
      */}
      <MixtapeHeading
        thin={isTogether ? "On repeat" : "Menuju"}
        bold={isTogether ? "selama" : "hari itu"}
        className="text-3xl"
      />

      <div className="flex items-end gap-2">
        <span
          className="mt-2 block text-7xl font-(family-name:--tpl-font-heading) tracking-tighter"
          style={{
            color: "var(--tpl-text-tertiary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          {value}
        </span>

        <span
          className="mb-1 block text-lg font-(family-name:--tpl-font-body)"
          style={{ opacity: 0.85 }}
        >
          {isTogether ? "hari" : "hari lagi"}
        </span>
      </div>

      <Checkerboard className="bottom-0 left-0 h-[30%] w-full" />
    </section>
  );
}
