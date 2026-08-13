import { formatDate } from "@/features/invitation/lib/datetime";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Checkerboard } from "../motifs/checkerboard";
import { Doodle } from "../motifs/doodle";
import { MixtapePill } from "../motifs/pill";
import { Seal } from "../motifs/seal";
import { BottomToTopScribble } from "../motifs/bottom-to-top-scribble";

type MixtapeCoverProps = {
  inv: InvitationState;
  guest?: string;
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

export function MixtapeCover({ inv, guest, onOpen }: MixtapeCoverProps) {
  const [first, second] = coupleOrder(inv);
  const year = eventYear(inv);

  return (
    <section className="relative flex h-full flex-col items-center justify-center">
      <Checkerboard className="top-0 right-0 h-1/4 w-full rotate-90 origin-top-left translate-x-full" />
      <Doodle variant="flower" className="left-[-26%] top-[2%] w-[78%]" />

      <div className="absolute top-1/5 z-10 whitespace-nowrap self-start w-full">
        <span
          className="inline-flex w-full px-3 py-1.5 text-5xl font-(family-name:--tpl-font-heading)"
          style={{
            backgroundColor: "var(--tpl-bg-secondary)",
            color: "var(--tpl-text-secondary)",
            fontWeight: "var(--tpl-weight-heading)",
          }}
        >
          The Wedding of
        </span>
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
          className="block text-6xl font-(family-name:--tpl-font-heading) tracking-tighter"
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
          {first} &amp; {second}
        </span>
      </div>

      {/* <Doodle variant="scribble" className="left-[8%] top-[44%] w-[62%]" /> */}
      {/* <Doodle variant="scribble" className="left-[8%] top-[44%] w-[62%]" /> */}
      <BottomToTopScribble />
      {/* <Seal
        outerText="KETUK UNTUK BUKA ·"
        innerText={year ? `${year} ·` : "UNDANGAN ·"}
        className="bottom-[11%] left-1 w-[47%]"
      /> */}

      {/* <div className="text-center">
        <h4>
          Dear <span className="font-bold">{guest || "Guest"}</span>
        </h4>
        <p>You&apos;re invited to our wedding</p>
      </div> */}

      <div className="absolute bottom-[10%] z-50 flex flex-col items-center gap-9">
        <div className="text-center">
          <h4>
            Dear <span className="font-bold">{guest || "Guest"}</span>
          </h4>
          <p>You&apos;re invited to our wedding</p>
        </div>
        <MixtapePill
          as="button"
          onClick={onOpen}
          className="hover:bg-(--tpl-bg-secondary)/95 hover:text-(--tpl-text-secondary)/95"
        >
          Buka Undangan
        </MixtapePill>
      </div>
    </section>
  );
}
