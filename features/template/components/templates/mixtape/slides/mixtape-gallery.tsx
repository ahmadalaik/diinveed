import Image from "next/image";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import { MixtapeHeading } from "../motifs/heading";

type MixtapeGalleryProps = {
  inv: InvitationState;
  onOpenLightbox: (index: number) => void;
};

export function MixtapeGallery({ inv, onOpenLightbox }: MixtapeGalleryProps) {
  const photos = inv.gallery.items.filter((item) => item.url);

  return (
    <section className="relative flex h-full flex-col justify-center px-6 py-12">
      <MixtapeHeading thin="Potret" bold="favorit" className="text-3xl" />

      <div className="relative z-50 mt-5 grid grid-cols-3 gap-1.5">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`Buka foto ${index + 1}`}
            onClick={() => onOpenLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-sm"
            style={{ backgroundColor: "var(--tpl-bg-tertiary)" }}
          >
            <Image
              src={photo.url}
              alt=""
              fill
              sizes="(min-width: 640px) 160px, 30vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
