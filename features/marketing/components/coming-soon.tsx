"use client";

import { motion } from "motion/react";
import { Sparkles, Heart } from "lucide-react";

function Instagram(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function ComingSoon() {
  return (
    <div className="relative min-h-dvh bg-landing-paper text-landing-ink overflow-hidden flex flex-col font-sans">
      {/* Premium Noise Overlay for watercolor/matte paper texture */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative Elegant Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-champagne/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-landing-rose/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <span className="font-prata text-2xl tracking-widest font-semibold text-landing-ink">
            onestoria
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-landing-rose" />
        </motion.div>
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-landing-smoke hover:text-landing-rose transition-colors duration-300"
          >
            <Instagram className="w-4 h-4 stroke-[1.25]" />
            <span>@onestoria</span>
          </a>
        </motion.div> */}
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
        {/* Left: Text & Newsletter Signup */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center space-y-8 max-w-xl">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-landing-rose/20 bg-landing-rose/5 text-[10px] uppercase tracking-[0.2em] font-medium text-landing-rose">
              <Sparkles className="w-3 h-3 text-landing-rose stroke-[1.5]" />
              Segera Hadir
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="font-prata text-4xl sm:text-5xl lg:text-6xl text-landing-ink leading-[1.1] tracking-tight"
            >
              Abadikan Cerita Indah{" "}
              <span className="font-sacramento text-landing-rose block mt-1.5 normal-case font-normal text-5xl sm:text-6xl lg:text-7xl">
                Pernikahan Anda
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="text-landing-smoke text-base sm:text-lg leading-relaxed font-sans font-light"
            >
              onestoria hadir untuk membantu Anda menciptakan undangan digital
              yang tidak hanya elegan, tetapi juga personal. Abadikan kisah
              cinta Anda dalam desain eksklusif yang dirancang dengan penuh
              rasa.
            </motion.p>
          </div>
        </div>

        {/* Right: Layered Floating Cards */}
        <div className="col-span-1 md:col-span-5 h-112.5 md:h-150 relative flex items-center justify-center">
          {/* Card 1: Back Left (Dark Editorial Theme) */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -15, y: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: -8,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.4 },
              x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              },
            }}
            className="absolute left-4 top-16 w-57.5 sm:w-65 aspect-3/4.5 rounded-[2rem] bg-landing-ink p-1.5 shadow-2xl origin-bottom-left select-none pointer-events-none"
          >
            <div className="w-full h-full rounded-[1.625rem] border border-white/10 p-6 flex flex-col justify-between items-center text-center bg-landing-ink/90 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(183,110,121,0.08)_0%,transparent_70%]" />
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <Heart className="w-3 h-3 text-white/50 fill-white/10" />
              </div>
              <div className="space-y-3 z-10">
                <p className="text-[9px] uppercase tracking-[0.25em] text-champagne/80 font-medium">
                  The Wedding of
                </p>
                <h3 className="font-prata text-3xl text-champagne leading-none">
                  Citra
                  <span className="font-sacramento text-landing-rose text-4xl block my-1">
                    &
                  </span>
                  Rama
                </h3>
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-sans z-10">
                12 • 12 • 2026
              </div>
            </div>
          </motion.div>

          {/* Card 2: Back Right (Soft Sage/Champagne Theme) */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 12, y: 30 }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: 6,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.5 },
              x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
            className="absolute right-4 bottom-12 w-55 sm:w-62.5 aspect-3/4.5 rounded-[2rem] bg-champagne/40 p-1.5 shadow-2xl origin-bottom-right select-none pointer-events-none"
          >
            <div className="w-full h-full rounded-[1.625rem] border border-landing-ink/5 p-6 flex flex-col justify-between items-center text-center bg-[#fcfaf5]/90 relative overflow-hidden">
              <div className="text-[9px] uppercase tracking-[0.2em] text-landing-smoke font-sans">
                Save The Date
              </div>

              <div className="space-y-2">
                <span className="font-sacramento text-landing-rose text-4xl block leading-none">
                  Wedding
                </span>
                <p className="font-sans text-xs text-landing-ink tracking-widest font-light uppercase">
                  Amel & Rafi
                </p>
              </div>

              <div className="w-full border-t border-landing-ink/10 pt-4 space-y-1">
                <p className="text-[8px] uppercase tracking-[0.15em] text-landing-smoke font-medium">
                  Sabtu, Jakarta
                </p>
                <p className="font-prata text-xs text-landing-rose font-semibold">
                  Desember 2026
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Front Center (Minimalist Fine-Art White Card) */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: [0, -14, 0],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 1, delay: 0.6 },
              scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute z-10 w-60 sm:w-70 aspect-3/4.5 rounded-[2rem] bg-white p-1.5 shadow-[0_25px_60px_-15px_rgba(16,20,20,0.15)] origin-center select-none pointer-events-none"
          >
            {/* Inner highlights for physical feel */}
            <div className="w-full h-full rounded-[1.625rem] border border-landing-ink/5 p-8 flex flex-col justify-between items-center text-center bg-white shadow-[inset_0_1px_2px_rgba(255,255,255,1)] relative overflow-hidden">
              {/* Elegant organic border */}
              <div className="absolute inset-4 border border-landing-rose/10 rounded-[0.625rem]" />

              <div className="z-10 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-landing-rose block mx-auto mb-2" />
                <p className="text-[8px] uppercase tracking-[0.3em] text-landing-smoke font-medium">
                  The Wedding of
                </p>
              </div>

              <div className="space-y-2 z-10">
                <h2 className="font-prata text-3xl sm:text-4xl text-landing-ink leading-tight">
                  Elisa
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-6 bg-landing-rose/25" />
                  <span className="font-sacramento text-landing-rose text-3xl font-medium">
                    &
                  </span>
                  <span className="h-px w-6 bg-landing-rose/25" />
                </div>
                <h2 className="font-prata text-3xl sm:text-4xl text-landing-ink leading-tight">
                  Theo
                </h2>
              </div>

              <div className="z-10 space-y-4 mb-2">
                <div className="text-[8px] uppercase tracking-[0.25em] text-landing-smoke font-medium">
                  Sabtu, 12 Desember 2026
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-landing-rose/5 border border-landing-rose/15 text-[9px] uppercase tracking-widest text-landing-rose font-medium">
                  Buka Undangan
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 mt-auto border-t border-landing-ink/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-xs text-landing-smoke/80 font-sans font-light">
          &copy; {new Date().getFullYear()} onestoria. Semua hak dilindungi.
        </p>
        <p className="text-xs text-landing-smoke/80 font-sans font-light flex items-center gap-1">
          Dibuat dengan cinta untuk hari bahagia Anda{" "}
          <Heart className="w-3 h-3 text-landing-rose fill-landing-rose" />
        </p>
      </footer>
    </div>
  );
}
