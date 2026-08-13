"use client";

import { useId } from "react";

type SealProps = {
  outerText: string;
  innerText: string;
  className?: string;
};

/**
 * Segel bergerigi. Gerigi dibuat dari `<circle>` ber-stroke dengan
 * `strokeDasharray="0 9.6"` dan `strokeLinecap="round"` — titik bundar
 * yang berjajar di keliling, jauh lebih ringkas daripada menggambar
 * path bergelombang manual.
 */
export function Seal({ outerText, innerText, className }: SealProps) {
  const rawId = useId();
  const outerId = `${rawId}-outer`;
  const innerId = `${rawId}-inner`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute ${className ?? ""}`}
    >
      <circle cx="50" cy="50" r="33" fill="var(--tpl-bg-tertiary)" />
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke="var(--tpl-bg-tertiary)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="0 9.6"
      />
      <path id={outerId} d="M50 23a27 27 0 1 1 -.1 0" fill="none" />
      <path id={innerId} d="M50 33a17 17 0 1 1 -.1 0" fill="none" />
      <text
        fontFamily="var(--tpl-font-heading)"
        fontSize="8"
        fontWeight="800"
        letterSpacing="1"
        fill="var(--tpl-text-primary)"
      >
        <textPath href={`#${outerId}`}>{outerText}</textPath>
      </text>
      <text
        fontFamily="var(--tpl-font-heading)"
        fontSize="5.6"
        fontWeight="700"
        letterSpacing="1"
        fill="var(--tpl-text-primary)"
      >
        <textPath href={`#${innerId}`}>{innerText}</textPath>
      </text>
    </svg>
  );
}
