"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface Props {
  children: ReactNode;
  inv: InvitationState;
}

export function KalandraLayout({ children, inv }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const filterItems = inv.gallery?.items?.filter((g) => g.url.trim() !== "");
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterItems || filterItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filterItems.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [filterItems]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;
    
    if (!wrapperRef.current || !contentRef.current) return;

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main
      ref={wrapperRef}
      className="fixed right-0 top-0 w-full lg:w-[30%] h-dvh overflow-y-auto overflow-x-hidden scroll-smooth z-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <div className="fixed top-0 right-0 inset-x-0 lg:inset-x-auto h-dvh w-full lg:w-[30%] pointer-events-none -z-10">
        {inv.gallery.items
          .filter((g) => g.url)
          .map((gallery, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-5000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0",
              )}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${gallery.url})`,
              }}
            />
          ))}
      </div>
      <div ref={contentRef} className="relative z-0">{children}</div>
    </main>
  );
}
