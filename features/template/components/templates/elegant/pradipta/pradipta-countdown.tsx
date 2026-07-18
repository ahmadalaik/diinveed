"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { toDateTime } from "@/features/invitation/lib/datetime";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

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

export function PradiptaCountdown({ inv }: Props) {
  const mainEvent = inv.events[0];
  const gallery = inv.gallery.items.filter((g) => g.url);
  const extendedGallery = gallery.length > 0 ? [...gallery, gallery[0]] : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [prevGalleryLength, setPrevGalleryLength] = useState(gallery.length);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  if (gallery.length !== prevGalleryLength) {
    setPrevGalleryLength(gallery.length);
    if (gallery.length <= 1 || currentIndex > gallery.length) {
      setCurrentIndex(0);
      setIsTransitioning(false);
    }
  }

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (gallery.length <= 1) {
      return;
    }

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
  }, [gallery.length]);

  useEffect(() => {
    if (gallery.length > 1 && currentIndex === gallery.length) {
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

  const createGoogleCalendarUrl = () => {
    if (!mainEvent) return "#";

    const start = toDateTime(
      mainEvent.date,
      mainEvent.timeStart,
      mainEvent.timezone,
    );
    let end = toDateTime(mainEvent.date, mainEvent.timeEnd, mainEvent.timezone);

    if (start && !end) {
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default to 2 hours
    }

    const formatForGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates =
      start && end ? `${formatForGCal(start)}/${formatForGCal(end)}` : "";

    const coupleNme = `${inv.isBrideFirst ? `${inv.brideNickname} & ${inv.groomNickname}` : `${inv.groomNickname} & ${inv.brideNickname}`}`;
    const title = encodeURIComponent(`The Wedding of ${coupleNme}`);
    const details = encodeURIComponent(
      `Acara: ${mainEvent.title}\n\n${mainEvent.description || ""}`,
    );
    const location = encodeURIComponent(mainEvent.locationName || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dates ? `&dates=${dates}` : ""}`;
  };

  return (
    <section className="relative px-8 py-24 text-center overflow-hidden">
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
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10">
        <motion.p
          className={cn(
            "text-4xl font-medium tracking-wider text-stone-50 mb-6 ",
            "font-(family-name:--tpl-font-heading) [text-transform:var(--tpl-transform-heading)]",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={fadeUp(0)}
        >
          Save the Date
        </motion.p>

        <motion.div
          className={cn(
            "grid grid-cols-4 gap-4",
            "text-(--tpl-text-secondary)",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
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

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-150px" }}
          variants={fadeUp(0.5)}
          className="mt-10"
        >
          <Button
            asChild
            variant="outline"
            className={cn(
              "bg-transparent border-(--tpl-bg-primary) text-(--tpl-text-secondary)",
              "hover:bg-(--tpl-text-secondary)/10 hover:text-(--tpl-text-secondary)",
              "text-[10px] tracking-[0.2em] px-8 h-12",
              "[text-transform:var(--tpl-transform-body)]",
            )}
          >
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar strokeWidth={1.5} className="w-4 h-4 mr-2" />
              Save the Date
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
