"use client";

/**
 * ============================================================================
 *  PoC: "Sun of Monet" — immersive hero TANPA WebGL
 * ============================================================================
 *
 * Tujuan file ini: MENGAJARKAN 5 trik yang, kalau ditumpuk, menghasilkan
 * ilusi "3D immersive" untuk undangan — cukup pakai `motion` + CSS, nol
 * dependency baru, ringan di HP.
 *
 *   1. Scroll-linked parallax  -> sumbu kedalaman utama (layer beda kecepatan)
 *   2. Pinned / sticky scene   -> ilusi "kamera bergerak", bukan halaman lewat
 *   3. CSS 3D + pointer/gyro    -> kedalaman terasa walau sedang diam
 *   4. Partikel ambient         -> petals melayang = suasana "Monet" hidup
 *   5. Atmosfer & cahaya (CSS)  -> sun glow, blend mode, grain, depth-of-field
 *
 * Semua angka di sini sengaja gampang diubah — geser-geser untuk merasakan
 * efeknya. Aset masih placeholder (gradient + SVG), belum perlu gambar asli.
 */

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";

// --- Helper kecil: nilai acak stabil untuk partikel --------------------------
// Dibuat sekali di module-scope supaya posisi petals tidak "loncat" tiap render.
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: Math.round(Math.random() * 100), // %
  size: 8 + Math.round(Math.random() * 16), // px
  delay: Math.random() * 6, // s
  duration: 8 + Math.random() * 8, // s
  drift: (Math.random() - 0.5) * 80, // px geser horizontal saat jatuh
  spin: Math.random() > 0.5 ? 360 : -360,
}));

export function SunOfMonetHero() {
  // Section pembungkus yang TINGGI (300vh). Scene di dalamnya nanti `sticky`,
  // jadi user scroll sejauh 300vh sementara scene tetap menempel di layar.
  // Inilah inti TRIK #2 (pinned scene).
  const sectionRef = useRef<HTMLElement>(null);

  // --- TRIK #1: progress scroll 0 -> 1 sepanjang section --------------------
  // offset ["start start", "end end"]: 0 saat atas section menyentuh atas
  // viewport, 1 saat bawah section menyentuh bawah viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Setiap layer dipetakan ke kecepatan parallax berbeda. Layer JAUH bergerak
  // sedikit, layer DEKAT bergerak banyak -> otak membaca itu sebagai jarak.
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const sunY = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]); // matahari "terbit"
  const sunScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.25]);
  const farHillY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const midHillY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const frontY = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  // Teks judul: muncul lalu naik & memudar saat user terus scroll.
  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.6],
    [0, 1, 1, 0],
  );
  const titleY = useTransform(scrollYProgress, [0, 0.6], ["0px", "-120px"]);

  // --- TRIK #3: pointer / gyro tilt -----------------------------------------
  // Dua MotionValue mentah (-0.5..0.5) lalu dihaluskan dengan spring supaya
  // gerakannya "berbobot", tidak patah-patah.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  // Rotasi panggung 3D mengikuti pointer. Amplitudo kecil saja (≤8°) — terlalu
  // besar malah bikin mabuk dan merusak ilusi.
  const rotX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotY = useTransform(sx, [-0.5, 0.5], ["-8deg", "8deg"]);

  useEffect(() => {
    // Desktop: pakai posisi mouse relatif ke tengah layar.
    const onPointer = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    // HP (Android otomatis; iOS 13+ butuh requestPermission via gesture user —
    // sengaja tidak diminta di PoC agar tetap sederhana).
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      px.set(Math.max(-0.5, Math.min(0.5, e.gamma / 45))); // kiri-kanan
      py.set(Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45))); // depan-belakang
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [px, py]);

  return (
    <main className="bg-[#1a1410] text-amber-50">
      {/* SECTION TINGGI: ruang scroll untuk TRIK #1 & #2 */}
      <section ref={sectionRef} className="relative h-[300vh]">
        {/* SCENE STICKY: menempel di layar selama section di-scroll (#2) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* PANGGUNG 3D: perspective + preserve-3d agar translateZ tiap layer
              menghasilkan kedalaman, lalu seluruh panggung dimiringkan oleh
              pointer/gyro (#3). */}
          <motion.div
            className="absolute inset-0"
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
              rotateX: rotX,
              rotateY: rotY,
            }}
          >
            {/* (a) LANGIT — paling jauh, gerak paling lambat. Gradient Monet:
                ungu malam -> oranye matahari. */}
            <motion.div
              className="absolute inset-0"
              style={{
                y: skyY,
                translateZ: -300,
                scale: 1.4, // kompensasi translateZ agar tidak ada celah tepi
                background:
                  "linear-gradient(180deg,#2a1a3a 0%,#6b3b5a 38%,#c96a4e 68%,#f0a868 100%)",
              }}
            />

            {/* (b) MATAHARI — disc + glow (#5 atmosfer). screen blend agar
                cahayanya "membakar" langit di belakangnya. */}
            <motion.div
              className="absolute left-1/2 top-[42%] -translate-x-1/2"
              style={{ y: sunY, scale: sunScale, translateZ: -260 }}
            >
              <div className="relative h-56 w-56">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#fff3d0_0%,#ffcf8a_40%,#ff9b54_70%,transparent_72%)] mix-blend-screen" />
                <div className="absolute inset-[-60%] rounded-full bg-[radial-gradient(circle,rgba(255,200,120,0.45)_0%,transparent_60%)] mix-blend-screen blur-2xl" />
              </div>
            </motion.div>

            {/* (c) BUKIT JAUH — diberi blur = depth-of-field palsu (#5). */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[55%] blur-sm"
              style={{ y: farHillY, translateZ: -160, scale: 1.2 }}
            >
              <Hill className="fill-[#7a4a55]" />
            </motion.div>

            {/* (d) BUKIT TENGAH — lebih tajam, parallax lebih cepat. */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[42%]"
              style={{ y: midHillY, translateZ: -80, scale: 1.1 }}
            >
              <Hill className="fill-[#4a2b3a]" flip />
            </motion.div>

            {/* (e) FOREGROUND — siluet bunga, paling dekat & paling cepat.
                Ini yang "menyapu" ke atas saat scroll, menjual kedalaman. */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-[40%]"
              style={{ y: frontY, translateZ: 40, scale: 1.05 }}
            >
              <Florals className="fill-[#1a0f14]" />
            </motion.div>
          </motion.div>

          {/* --- TRIK #4: PARTIKEL PETALS ------------------------------------
              Di luar panggung 3D (selalu menghadap kamera) supaya jatuhnya
              tetap natural. Tiap kelopak loop dengan delay/durasi acak. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {PETALS.map((p) => (
              <motion.span
                key={p.id}
                className="absolute top-[-10%] rounded-[60%_40%_55%_45%] bg-rose-200/70"
                style={{ left: `${p.left}%`, width: p.size, height: p.size }}
                animate={{
                  y: ["-10vh", "110vh"],
                  x: [0, p.drift, 0],
                  rotate: [0, p.spin],
                  opacity: [0, 0.9, 0.9, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* --- TRIK #5: GRAIN OVERLAY --------------------------------------
              Tekstur halus di atas segalanya = "lukisan", bukan render bersih.
              (Kelana sudah pakai pola cream-paper dengan ide yang sama.) */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay [background-image:url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

          {/* JUDUL — di-drive scroll (#1), reveal lalu memudar. */}
          <motion.div
            className="absolute inset-x-0 top-[26%] flex flex-col items-center text-center"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <p className="mb-3 text-sm tracking-[0.4em] text-amber-100/80">
              THE WEDDING OF
            </p>
            <h1 className="font-serif text-5xl leading-tight drop-shadow-lg sm:text-7xl">
              Sun <span className="italic text-amber-200">of</span> Monet
            </h1>
            <ScrollCue progress={scrollYProgress} />
          </motion.div>
        </div>
      </section>

      {/* Konten sesudah hero — sekadar bukti scene melepas pin dengan mulus
          dan halaman lanjut normal. Di template asli, di sinilah section
          couple / countdown / dst. menyambung. */}
      <section className="flex h-screen items-center justify-center bg-gradient-to-b from-[#1a0f14] to-[#0d0a08] px-8 text-center">
        <p className="max-w-md font-serif text-2xl italic text-amber-100/80">
          “Seperti cahaya pagi yang Monet kejar seumur hidup — kami menemukannya
          dalam satu sama lain.”
        </p>
      </section>
    </main>
  );
}

/* ----------------------------- SVG placeholder ----------------------------- */
// Siluet sederhana; di produksi diganti PNG/SVG ilustrasi asli, prinsip
// layeringnya tetap sama persis.

function Hill({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={`h-full w-full ${flip ? "scale-x-[-1]" : ""} ${className ?? ""}`}
    >
      <path d="M0 220 C 240 120 480 300 720 200 C 960 110 1200 260 1440 180 L1440 320 L0 320 Z" />
    </svg>
  );
}

function Florals({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className={`h-full w-full ${className ?? ""}`}
    >
      {/* baris dasar + beberapa "tangkai" bergelombang */}
      <path d="M0 260 C 180 200 300 300 480 250 C 680 195 820 305 1040 250 C 1240 200 1340 290 1440 250 L1440 320 L0 320 Z" />
      {[120, 360, 700, 980, 1280].map((x, i) => (
        <path
          key={i}
          d={`M${x} 320 C ${x - 20} 250 ${x + 20} 230 ${x} 170 C ${x - 16} 215 ${x + 24} 235 ${x} 320 Z`}
        />
      ))}
    </svg>
  );
}

/* ------------------------------- Scroll cue -------------------------------- */
function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  // Menghilang begitu user mulai scroll — detail kecil yang bikin terasa "alive".
  const opacity = useTransform(progress, [0, 0.06], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="mt-10 flex flex-col items-center gap-2 text-amber-100/70"
    >
      <span className="text-xs tracking-widest">SCROLL</span>
      <motion.span
        className="block h-8 w-px bg-amber-100/60"
        animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
