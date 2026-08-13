export function BottomToTopScribble() {
  const strokes = [
    {
      placement: "top-loop",
      delay: "0.55s",
      path: [
        "M -32 188",
        "C 72 132 214 78 382 44",
        "C 458 29 482 -8 430 -34",
        "C 356 -70 254 -37 207 18",
        "C 164 69 174 133 234 164",
        "C 286 190 358 174 466 112",
      ].join(" "),
    },
    {
      placement: "upper-sweep",
      delay: "0.2s",
      transform: "translate(0 320)",
      path: ["M -20 520", "C 125 500 300 478 470 454"].join(" "),
    },
    {
      placement: "bottom-sweep",
      delay: "0s",

      // Mengatur posisi seluruh garis
      transform: "translate(0 250)",

      path: [
        // Garis atas: kanan menuju kiri
        "M 470 525",
        "C 355 540 228 568 92 606",

        // Ujung melengkung di kiri
        "C 60 615 38 629 48 634",

        // Garis bawah: kembali menuju kanan
        "C 63 642 110 628 164 613",
        "C 273 583 365 558 470 546",
      ].join(" "),
    },
    {
      placement: "right-flick",
      delay: "1.05s",
      transform: "translate(0 150)",
      path: [
        "M 462 615",
        "C 421 623 382 621 358 610",
        "C 388 596 429 584 468 568",
      ].join(" "),
    },
  ] as const;

  return (
    <svg
      viewBox="0 0 430 932"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-5 h-full w-full"
    >
      <defs>
        <filter
          id="mixtape-hand-drawn-line"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      {strokes.map((stroke) => (
        <path
          key={stroke.placement}
          data-scribble-stroke
          data-placement={stroke.placement}
          d={stroke.path}
          transform={"transform" in stroke ? stroke.transform : undefined}
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          filter="url(#mixtape-hand-drawn-line)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            begin={stroke.delay}
            dur="1.65s"
            fill="freeze"
          />
        </path>
      ))}
    </svg>
  );
}
