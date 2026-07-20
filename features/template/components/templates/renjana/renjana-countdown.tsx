"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { toDateTime } from "@/features/invitation/lib/datetime";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
  },
});

interface Props {
  inv: InvitationState;
}

export function CountdownRenjana({ inv }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const mainEvent = inv.events[0];
  const gallery = inv.gallery.items.filter((g) => g.url);
  const extendedGallery = gallery.length > 0 ? [...gallery, gallery[0]] : [];

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          handleNext();
        }, 5000);
      }
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    if (!document.hidden) {
      startInterval();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (currentIndex === gallery.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, gallery.length]);

  useEffect(() => {
    const target = toDateTime(
      mainEvent?.date,
      mainEvent?.timeStart,
      mainEvent?.timezone,
    );
    if (!target) {
      return;
    }
    const weddingDate = target.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mainEvent?.date, mainEvent?.timeStart, mainEvent?.timezone]);

  return (
    <section
      ref={ref}
      className="relative px-8 py-24 bg-[#a85d6b] text-center overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-0 flex",
          isTransitioning
            ? "transition-transform duration-1000 ease-in-out"
            : "transition-none",
        )}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedGallery.map((gallery, index) => (
          <div
            key={index}
            className="w-full h-full shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${gallery.url})`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[#6b4a4a]/55" />

      <div className="relative z-10">
        <motion.p
          className="text-xs font-medium [text-transform:uppercase] tracking-[0.2em] text-stone-50 mb-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0)}
        >
          Save the Date
        </motion.p>

        <motion.div
          className="grid grid-cols-2 gap-4 font-(family-name:--font-serif) text-[#e5e0d6]"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.25)}
        >
          <div>
            <span className="text-2xl font-semibold">{timeLeft.days}</span>
            <span className="text-[9px] uppercase text-stone-200 block mt-1">
              Hari
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.hours}</span>
            <span className="text-[9px] uppercase text-stone-200 block mt-1">
              Jam
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.minutes}</span>
            <span className="text-[9px] uppercase text-stone-200 block mt-1">
              Menit
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold">{timeLeft.seconds}</span>
            <span className="text-[9px] uppercase text-stone-200 block mt-1">
              Detik
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
