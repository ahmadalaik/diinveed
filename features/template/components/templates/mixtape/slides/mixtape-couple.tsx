import Image from "next/image";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Doodle } from "../motifs/doodle";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeCoupleProps = { inv: InvitationState };

type Person = {
  name: string;
  description: string | null;
  image: string | null;
};

function orderedPeople(inv: InvitationState): [Person, Person] {
  const bride: Person = {
    name: inv.brideName,
    description: inv.brideDescription,
    image: inv.brideImage,
  };
  const groom: Person = {
    name: inv.groomName,
    description: inv.groomDescription,
    image: inv.groomImage,
  };
  return inv.isBrideFirst ? [bride, groom] : [groom, bride];
}

function PersonCard({ person }: { person: Person }) {
  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-sm"
        style={{ backgroundColor: "var(--tpl-bg-tertiary)" }}
      >
        {person.image ? (
          <Image
            src={person.image}
            alt={person.name}
            fill
            sizes="(min-width: 640px) 240px, 45vw"
            className="object-cover"
          />
        ) : null}
      </div>
      {/* <p
        className="mt-2 text-base font-(family-name:--tpl-font-heading)"
        style={{ fontWeight: "var(--tpl-weight-heading)" }}
      >
        {person.name}
      </p>
      {person.description ? (
        <p
          className="mt-1 text-xs font-(family-name:--tpl-font-body)"
          style={{ opacity: 0.8 }}
        >
          {person.description}
        </p>
      ) : null} */}
    </div>
  );
}

export function MixtapeCouple({ inv }: MixtapeCoupleProps) {
  const [first, second] = orderedPeople(inv);

  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <Doodle variant="burst" className="right-[2%] top-[10%] w-[36%]" />
      <MixtapeHeading thin="Menikah:" bold="dua orang ini" className="text-3xl" />
      <div className="mt-5 grid grid-cols-2 gap-4">
        <PersonCard person={first} />
        <PersonCard person={second} />
      </div>
    </section>
  );
}
