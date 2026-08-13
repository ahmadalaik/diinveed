type DoodleVariant = "flower" | "burst" | "scribble";

type DoodleProps = { variant: DoodleVariant; className?: string };

const PATHS: Record<DoodleVariant, { viewBox: string; d: string[] }> = {
  flower: {
    viewBox: "0 0 120 120",
    d: [
      "M60 62c-5-22 6-37 19-33 12 4 11 24-5 30-14 5-27-7-21-21",
      "M60 62c17-13 35-9 37 4 2 12-15 20-26 9-10-10-2-24 13-26",
      "M60 62c9 20 2 36-11 36-12 0-17-18-4-26 13-9 26 1 24 15",
      "M60 62c-20 7-34-2-33-15 1-12 20-15 27-2 7 12-3 24-17 22",
    ],
  },
  burst: {
    viewBox: "0 0 100 70",
    d: ["M50 6c3 18 12 25 30 27-18 3-27 11-30 30-3-19-12-27-30-30 18-2 27-9 30-27Z"],
  },
  scribble: {
    viewBox: "0 0 100 40",
    d: [
      "M2 20l16-9-14 13 20-11-17 14 22-12-18 15 24-13-20 16 26-14-21 17 28-15",
    ],
  },
};

/** Coretan tangan satu ketebalan. Warna mengikuti `currentColor`. */
export function Doodle({ variant, className }: DoodleProps) {
  const { viewBox, d } = PATHS[variant];

  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      className={`mixtape-doodle pointer-events-none absolute ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/*
        `pathLength={1}` menormalkan panjang tiap path ke 1 satuan, sehingga
        `stroke-dasharray: 1` di CSS benar-benar menutupi seluruh garis dan
        animasi `stroke-dashoffset` 1 -> 0 menggambarnya dari ujung ke ujung.
        Ini atribut SVG dan wajib di sini — versi CSS-nya tidak ada.
      */}
      {d.map((path) => (
        <path key={path} d={path} pathLength={1} />
      ))}
    </svg>
  );
}
