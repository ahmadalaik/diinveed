import Image from "next/image";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { Doodle } from "../motifs/doodle";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeBrideProps = { inv: InvitationState };

export function MixtapeBride({ inv }: MixtapeBrideProps) {
  const name = inv.brideName;
  const description = inv.brideDescription;
  const image = inv.brideImage;

  return (
    <section className="relative flex h-full flex-col justify-center px-6">
      <Doodle variant="flower" className="right-[2%] top-[8%] w-[36%]" />
      <MixtapeHeading thin="Mempelai" bold="Wanita" className="text-3xl" />
      <div className="mt-5 flex flex-col items-center">
        <div
          className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-sm"
          style={{ backgroundColor: "var(--tpl-bg-tertiary)" }}
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 640px) 280px, 75vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>
        <div className="mt-4 text-center w-full max-w-[280px]">
          <p
            className="text-lg font-(family-name:--tpl-font-heading)"
            style={{ fontWeight: "var(--tpl-weight-heading)" }}
          >
            {name}
          </p>
          {description ? (
            <p
              className="mt-1 text-sm font-(family-name:--tpl-font-body)"
              style={{ opacity: 0.8 }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
