interface MixtapeHeadingProps {
  thin: string;
  bold: string;
  className?: string;
}

/**
 * Judul dua bobot menyatu dalam satu kalimat yang membungkus alami —
 * ciri paling khas sistem visual ini. Bagian tipis memakai konstanta
 * `--mixtape-heading-thin`, bagian tebal memakai token heading.
 */
export function MixtapeHeading({ thin, bold, className }: MixtapeHeadingProps) {
  return (
    <h2
      className={`font-(family-name:--tpl-font-heading) leading-[1.03] tracking-tight ${className ?? ""}`}
      style={{ fontWeight: "var(--mixtape-heading-thin)" }}
    >
      {thin}{" "}
      <strong style={{ fontWeight: "var(--tpl-weight-heading)" }}>
        {bold}
      </strong>
    </h2>
  );
}
