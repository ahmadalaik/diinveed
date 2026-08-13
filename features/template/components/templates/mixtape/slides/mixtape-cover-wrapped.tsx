import { formatDate } from "@/features/invitation/lib/datetime";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Checkerboard } from "../motifs/checkerboard";
import { Doodle } from "../motifs/doodle";
import { MixtapePill } from "../motifs/pill";
import { Seal } from "../motifs/seal";
import { BottomToTopScribble } from "../motifs/bottom-to-top-scribble";

type MixtapeCoverProps = {
  inv: InvitationState;
  onOpen: () => void;
};

function coupleOrder(inv: InvitationState): [string, string] {
  const bride = inv.brideNickname || inv.brideName;
  const groom = inv.groomNickname || inv.groomName;
  return inv.isBrideFirst ? [bride, groom] : [groom, bride];
}

function eventYear(inv: InvitationState): string {
  const first = inv.events.find((event) => event.date);
  // `formatDate` mengurai tanggal sebagai hari sipil lokal, jadi tidak ada
  // pergeseran UTC off-by-one seperti `new Date("2026-01-01")`.
  return first ? formatDate(first.date, "yyyy") : "";
}

export function MixtapeCover({ inv, onOpen }: MixtapeCoverProps) {
  const [first, second] = coupleOrder(inv);
  const year = eventYear(inv);

  return (
    <section className="relative flex h-full flex-col items-center justify-center">
      <Checkerboard className="top-0 right-[-35%] h-[20%] w-full rotate-90" />
      <Doodle variant="flower" className="left-[-26%] top-[2%] w-[78%]" />

      <div className="relative z-10 -rotate-90 text-center whitespace-nowrap">
        <span
          className="inline-block px-3 py-1.5 text-2xl font-(family-name:--tpl-font-heading)"
          style={{
            backgroundColor: "var(--tpl-bg-secondary)",
            color: "var(--tpl-text-secondary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          {first} &amp; {second}
        </span>
        {year ? (
          <span
            className="-mt-3.5 block text-5xl font-(family-name:--tpl-font-heading) tracking-tighter"
            style={{
              color: "var(--tpl-bg-tertiary)",
              fontWeight: "var(--tpl-weight-heading)",
            }}
          >
            {year}
          </span>
        ) : null}
      </div>

      <div className="absolute top-10 right-0 z-10 [writing-mode:vertical-lr] rotate-180 text-center whitespace-nowrap">
        {/* <span
          className="inline-block px-3 py-1.5 text-2xl font-(family-name:--tpl-font-heading)"
          style={{
            backgroundColor: "var(--tpl-bg-secondary)",
            color: "var(--tpl-text-secondary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          {first} &amp; {second}
        </span> */}
        <span
          className="block text-5xl font-(family-name:--tpl-font-heading) tracking-tighter"
          style={{
            color: "var(--tpl-bg-tertiary)",
            fontWeight: "var(--tpl-weight-heading)",
            textShadow: `
      -1px -1px 0 var(--tpl-bg-secondary),  
       1px -1px 0 var(--tpl-bg-secondary),
      -1px  1px 0 var(--tpl-bg-secondary),
       1px  1px 0 var(--tpl-bg-secondary)
    `,
          }}
        >
          Wedding of
        </span>
      </div>

      {/* <Doodle variant="scribble" className="left-[8%] top-[44%] w-[62%]" /> */}
      <Doodle variant="scribble" className="left-[8%] top-[44%] w-[62%]" />
      <BottomToTopScribble />
      {/* <Seal
        outerText="KETUK UNTUK BUKA ·"
        innerText={year ? `${year} ·` : "UNDANGAN ·"}
        className="bottom-[11%] left-1 w-[47%]"
      /> */}

      <div className="absolute bottom-50 z-50">
        <MixtapePill
          as="button"
          onClick={onOpen}
          className="hover:bg-(--tpl-bg-secondary)/80 hover:text-(--tpl-text-secondary)/80"
        >
          Buka Undangan
        </MixtapePill>
      </div>
    </section>
  );
}
