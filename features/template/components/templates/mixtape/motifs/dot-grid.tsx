type DotGridProps = { className?: string };

/** Grid lingkaran setengah-loncat, sengaja meluber keluar tepi kanvas. */
export function DotGrid({ className }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className ?? ""}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, currentColor 9.5px, transparent 10px)",
        backgroundSize: "23px 23px",
      }}
    />
  );
}
