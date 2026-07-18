"use client";

import { ReactNode, useEffect, useRef } from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface Props {
  children: ReactNode;
  inv?: InvitationState;
}

export function PradiptaLayout({ children }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
      className="fixed right-0 top-0 w-full lg:w-[30%] h-dvh overflow-y-auto overflow-x-hidden scroll-smooth z-10 scrollbar-none [&::-webkit-scrollbar]:hidden bg-(--tpl-bg-primary)"
    >
      <div ref={contentRef} className="relative z-0">
        {children}
      </div>
    </main>
  );
}
