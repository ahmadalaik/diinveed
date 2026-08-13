import type { InvitationState } from "@/features/invitation/types/invitation.type";
import {
  OURIFY_STANDARD_SECTION_CLASS,
  OurifySectionHeading,
} from "./ourify-motion";
import { OURIFY_REVIEW_PLACEHOLDERS } from "./ourify-review-placeholders";

const SAFE_COLOR = /^(#[\da-f]{3,8}|(?:rgb|hsl)a?\([\d\s.,%/-]+\))$/i;

export function OurifyDressCode({
  invitation,
}: {
  invitation: InvitationState;
}) {
  if (!invitation.dressCode.enabled) return null;

  const saved = invitation.dressCode.colors
    .filter((color) => SAFE_COLOR.test(color.trim()))
    .map((value, index) => ({
      name: `Pilihan ${index + 1}`,
      value,
    }));
  const fallback = OURIFY_REVIEW_PLACEHOLDERS.dressCodeSwatches.filter(
    (swatch) => !saved.some((item) => item.value === swatch.value),
  );
  const swatches = [...saved, ...fallback].slice(0, Math.max(4, saved.length));

  return (
    <section
      data-ourify-section="dress-code"
      aria-labelledby="ourify-dress-title"
      className={OURIFY_STANDARD_SECTION_CLASS}
    >
      <OurifySectionHeading id="ourify-dress-title" eyebrow="Dress The Part">
        Dress Code
      </OurifySectionHeading>
      <div className="mt-7 flex flex-wrap gap-4">
        {swatches.map((swatch) => (
          <span
            key={`${swatch.name}-${swatch.value}`}
            role="img"
            aria-label={`Warna dress code ${swatch.name}`}
            className="size-12 rounded-full border border-white/20 shadow-[inset_0_0_0_3px_rgba(0,0,0,0.16)]"
            style={{ backgroundColor: swatch.value }}
          />
        ))}
      </div>
      {invitation.dressCode.description ? (
        <p className="mt-6 text-[13px] leading-5 text-[#b3b3b3]">
          {invitation.dressCode.description}
        </p>
      ) : null}
    </section>
  );
}
