import { InvitationState } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface Props {
  inv: InvitationState;
  onOpen: (open: boolean) => void;
}

export default function EnvelopeTerracotta({ inv, onOpen }: Props) {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen(true);
    }, 800);
  };

  return (
    <section
      onClick={() => {
        setIsClosing(true);
        onOpen(true);
      }}
      className={cn(
        "fixed inset-0 z-50 h-screen flex items-center justify-center font-serif overflow-hidden transition-transform duration-1000 ease-in-out bg-ivory dark:bg-richblack",
        isClosing ? "-translate-y-full pointer-events-none" : "translate-y-0",
      )}
    >
      <div className="absolute inset-0 z-0">
        {inv.coverImage && (
          <Image
            fill
            preload
            sizes="100vw"
            src={inv.coverImage}
            alt="Wedding Background"
            className="w-full h-full object-cover opacity-80 dark:opacity-50 filter sepia-[0.15] contrast-[0.9] animate-slow-zoom"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-ivory/80 via-ivory/20 to-ivory dark:from-richblack/60 dark:via-richblack/20 dark:to-richblack" />
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl h-full flex flex-col items-center justify-end gap-2 py-20"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.3, delayChildren: 0.4 } },
        }}
      >
        <div className="flex flex-col">
          <p className="text-gold text-sm lg:text-base tracking-[0.3em] font-sans uppercase">
            The Wedding of
          </p>

          <h1 className="text-4xl lg:text-5xl tracking-tight font-light text-espresso dark:text-ivory leading-none">
            {inv.brideNickname}{" "}
            <span className="text-rosegold font-light italic text-5xl lg:text-7xl align-middle mx-2 opacity-80">
              &amp;
            </span>{" "}
            {inv.groomNickname}{" "}
          </h1>
        </div>

        <div className="flex flex-col gap-2 max-w-xs lg:max-w-lg mt-1">
          <p className="text-xl lg:text-xl text-camel dark:text-ivory font-light font-sans tracking-wide">
            Dear Guest
          </p>
          <p className="text-sm lg:text-base text-camel dark:text-champagne font-light">
            &ldquo;We invite you to share in our joy and request your presence
            at our wedding.&rdquo;
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2.5 mt-4 px-10 py-4 bg-espresso dark:bg-gold text-ivory dark:text-white hover:bg-gold dark:hover:bg-camel hover:text-white dark:hover:text-white transition-all duration-400 tracking-[0.2em] text-xs font-sans uppercase rounded-full shadow-sm hover:shadow-lg"
          onClick={handleOpen}
        >
          Open Invitation
          <ArrowRight className="size-4 animate-[envelope-bounce_3s_ease-in-out_infinite_forwards]" />
        </button>
      </motion.div>
    </section>
  );
}
