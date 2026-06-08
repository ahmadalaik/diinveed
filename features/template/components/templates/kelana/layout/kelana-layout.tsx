"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { cldUrl } from "@/lib/cloudinary-url";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  children: ReactNode;
  inv: InvitationState;
}

export function KelanaLayout({ children, inv }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (inv.gallery.length <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % inv.gallery.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [inv.gallery.length]);

  return (
    <main className="fixed right-0 top-0 w-full lg:w-[30%] h-dvh overflow-y-auto overflow-x-hidden bg-stone-900 scroll-smooth z-10 scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="fixed top-0 right-0 inset-x-0 lg:inset-x-auto h-dvh w-full lg:w-[30%] pointer-events-none -z-10">
        {inv.gallery
          .filter((g) => g.url)
          .map((gallery, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-5000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0",
              )}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${cldUrl(gallery.url, "f_auto,q_auto,w_1080")})`,
              }}
            />
          ))}
      </div>
      <div className="relative z-0">{children}</div>
    </main>
  );
}
