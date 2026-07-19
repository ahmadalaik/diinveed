"use client";

import { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface Props {
  children: ReactNode;
}

export function SmoothScroll({ children }: Props) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        duration: 2.5,
        wheelMultiplier: 0.5,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
