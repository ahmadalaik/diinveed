"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { InvitationState } from "@/features/invitation/types/invitation.type";

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

export function GalleryAgnimaya({ inv, openLightbox }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const filterItems = inv.gallery?.items?.filter((g) => g.url.trim() !== "");

  const preloadImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  return (
    <section ref={ref} className="px-8 py-24 bg-(--tpl-bg-primary) border-b border-(--tpl-bg-tertiary)/10">
      <motion.div
        className="text-center mb-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={headingVariants}
      >
        <span className="text-(--tpl-text-secondary) font-(family-name:--tpl-font-body) text-xs tracking-[0.3em] uppercase block mb-4">
          Our Moments
        </span>
        <h2 className="font-(family-name:--tpl-font-heading) font-light text-3xl text-(--tpl-text-primary) tracking-tight">
          Gallery
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-2"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={gridVariants}
      >
        {filterItems.map((gallery, index) => (
          <motion.div
            key={gallery.id}
            className="aspect-square relative group overflow-hidden rounded-2xl cursor-zoom-in"
            variants={itemVariants}
            onClick={() => openLightbox(gallery.url)}
            onMouseEnter={() => preloadImage(gallery.url)}
          >
            <Image
              fill
              src={gallery.url}
              alt={`Gallery ${index + 1}`}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover lg:grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
