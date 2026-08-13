const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)'/%3E%3C/svg%3E\")";

type GrainProps = { tone: "lite" | "dark" };

/** Lapisan grain berbintik. Ada di semua permukaan Mixtape. */
export function Grain({ tone }: GrainProps) {
  const isLite = tone === "lite";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE_URL,
          mixBlendMode: isLite ? "multiply" : "screen",
          opacity: isLite ? 0.14 : 0.13,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: isLite ? 0.5 : 0.28,
          backgroundImage: isLite
            ? "radial-gradient(circle,#6B4B22 .7px,transparent .8px),radial-gradient(circle,#8A5C2B .6px,transparent .7px)"
            : "radial-gradient(circle,#EFEDE4 .7px,transparent .8px),radial-gradient(circle,#CFCCC2 .6px,transparent .7px)",
          backgroundSize: "47px 61px,73px 89px",
          backgroundPosition: "3px 11px,29px 43px",
        }}
      />
    </div>
  );
}
