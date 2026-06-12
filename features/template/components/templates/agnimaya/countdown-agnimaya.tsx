"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { toDateTime } from "@/features/invitation/lib/datetime";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";

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

export function CountdownAgnimaya({ inv }: Props) {
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
  const gallery = inv.gallery.filter((g) => g.url);
  const extendedGallery = gallery.length > 0 ? [...gallery, gallery[0]] : [];

  useEffect(() => {
    if (gallery.length === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [gallery.length]);

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
    if (!target) return;
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

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <section
      ref={ref}
      className="relative px-8 py-24 bg-espresso text-center overflow-hidden"
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
        {extendedGallery.map((item, index) => (
          <div
            key={index}
            className="w-full h-full shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.url})`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-espresso/80" />

      <div className="relative z-10">
        <motion.p
          className="text-gold text-xs font-sans uppercase tracking-[0.3em] mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0)}
        >
          Counting Down
        </motion.p>

        <motion.div
          className="grid grid-cols-4 gap-4 text-ivory"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp(0.25)}
        >
          {units.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <span className="text-3xl font-serif font-light tabular-nums">
                {unit.value}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-champagne font-sans mt-2">
                {unit.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
