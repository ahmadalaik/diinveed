"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { InvitationState } from "@/features/invitation/types/invitation.type";

interface Props {
  inv: InvitationState;
  onOpen: (open: boolean) => void;
}

export function EnvelopeAgnimaya({ inv, onOpen }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen(true);
    }, 800);
  };

  return (
    <section
      className={cn(
        "fixed right-0 top-0 z-50 transition-transform duration-1000 ease-in-out w-full lg:w-[30%] h-svh flex justify-center items-center px-8 py-14 text-center bg-ivory",
        isClosing ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        {inv.coverImage && (
          <Image
            src={inv.coverImage}
            alt="Thumbnail"
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            className="object-cover opacity-90 filter sepia-[0.15] contrast-[0.95]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-ivory/70 via-ivory/30 to-ivory" />
      </div>

      <div className="relative z-10 flex flex-col justify-end h-full w-full gap-2">
        <div className="flex flex-col">
          <p className="text-gold text-xs tracking-[0.3em] font-sans uppercase mb-2">
            The Wedding of
          </p>
          <h1 className="text-4xl lg:text-5xl font-serif font-light tracking-tight text-espresso leading-none">
            {inv.brideNickname}{" "}
            <span className="text-rosegold italic text-5xl lg:text-6xl align-middle mx-1 opacity-80">
              &amp;
            </span>{" "}
            {inv.groomNickname}
          </h1>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <span className="font-serif font-medium text-2xl text-espresso">
            Dear Guest
          </span>
          <p className="font-serif text-sm text-camel italic leading-relaxed text-balance">
            Sorry if there are any mistakes in writing names or titles
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 mx-auto mt-5 px-8 py-3.5 bg-espresso text-ivory hover:bg-gold hover:text-white transition-all duration-400 tracking-[0.2em] text-xs font-sans uppercase rounded-full shadow-sm hover:shadow-lg animate-[button-zoom_2s_ease-in-out_infinite_alternate] cursor-pointer"
          onClick={handleOpen}
        >
          <Mail strokeWidth={1.5} className="size-4" />
          Open Invitation
        </button>
      </div>
    </section>
  );
}
