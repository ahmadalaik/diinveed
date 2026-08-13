import { Doodle } from "../motifs/doodle";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeGreetingProps = { guestName: string };

export function MixtapeGreeting({ guestName }: MixtapeGreetingProps) {
  const displayName = guestName.trim() || "Guest";

  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <Doodle variant="burst" className="right-[-4%] top-[18%] w-[46%]" />
      <MixtapeHeading
        thin="Undangan ini khusus untuk"
        bold={displayName}
        className="text-4xl"
      />
      <p
        className="mt-4 max-w-[24ch] text-sm font-(family-name:--tpl-font-body)"
        style={{ opacity: 0.85 }}
      >
        Terima kasih sudah jadi bagian dari perjalanan kami.
      </p>
    </section>
  );
}
