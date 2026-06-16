"use client";

import { InvitationState } from "@/features/invitation/types/invitation.type";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

interface Props {
  inv: InvitationState;
  openLightbox: (src: string) => void;
}

export function GalleryRenjana({ inv, openLightbox }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const preloadImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  return (
    <section ref={ref} className="px-2 py-16 bg-[#fbf0ef]">
      <motion.div
        className="text-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={headingVariants}
      >
        <h2 className="font-(family-name:--font-serif) font-medium text-3xl text-[#a85d6b] tracking-tight mb-1">
          Gallery
        </h2>
        <p className="text-base text-[#9a7e7e] font-(family-name:--font-serif) font-light italic leading-relaxed mb-6">
          Our Moments
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-0.5"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={gridVariants}
      >
        {inv.gallery.filter((g) => g.url).map((gallery, index) => (
          <motion.div
            key={gallery.id}
            className="aspect-square relative group overflow-hidden cursor-zoom-in"
            variants={itemVariants}
            onClick={() => openLightbox(gallery.url)}
            onMouseEnter={() =>
              preloadImage(gallery.url)
            }
          >
            <Image
              fill
              src={gallery.url}
              alt={`Gallery ${index + 1}`}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="gallery-img w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
