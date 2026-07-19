"use client";

import { InvitationState, Gallery as GalleryType } from "@/features/invitation/types/invitation.type";
import { cn } from "@/lib/utils";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

interface Props {
  inv: InvitationState;
  layoutMode: "masonry" | "horizontal";
  openLightbox: (index: number) => void;
  className?: string;
  overlayClassName?: string;
}

export function Gallery({
  inv,
  layoutMode,
  openLightbox,
  className,
  overlayClassName = "bg-black/15",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const preloadImage = (src: string) => {
    const img = new window.Image();
    img.src = src;
  };

  // Kita filter gambar yang valid dan catat index berdasarkan array yang sudah di-filter
  // Karena Lightbox juga menggunakan array yang sama (sudah di-filter)
  const validItems = inv.gallery.items
    .filter((g) => g.url)
    .map((gallery, index) => ({ gallery, filteredIndex: index }));

  return (
    <section
      ref={sectionRef}
      className={cn("relative min-h-dvh px-8 py-24 snap-start", className)}
      style={{ clipPath: "inset(0)" }}
    >
      {overlayClassName && (
        <div className={cn("absolute inset-0 -z-10", overlayClassName)} />
      )}
      <div className="relative z-10">
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={headingVariants}
        >
          <h2
            className={cn(
              "font-medium text-4xl tracking-wider mb-1",
              "font-(family-name:--tpl-font-heading) text-(--tpl-text-primary)",
            )}
          >
            Our Moments
          </h2>
        </motion.div>

        {layoutMode === "horizontal" ? (
          <HorizontalGallery
            items={validItems}
            openLightbox={openLightbox}
            preloadImage={preloadImage}
          />
        ) : (
          <MasonryGallery
            items={validItems}
            openLightbox={openLightbox}
            preloadImage={preloadImage}
          />
        )}
      </div>
    </section>
  );
}

function HorizontalGallery({
  items,
  openLightbox,
  preloadImage,
}: {
  items: { gallery: GalleryType; filteredIndex: number }[];
  openLightbox: (index: number) => void;
  preloadImage: (src: string) => void;
}) {
  const slicedItems = items.slice(0, 10);
  const row1 = slicedItems.filter((_, i) => i % 2 === 0);
  const row2 = slicedItems.filter((_, i) => i % 2 !== 0);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const renderRow = (rowItems: typeof row1, rowIndex: number) => (
    <motion.div
      className="flex w-full overflow-x-auto gap-4 scrollbar-none"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {rowItems.map(({ gallery, filteredIndex }) => (
        <motion.div
          key={gallery.id}
          className="relative h-[25vh] shrink-0 overflow-hidden cursor-zoom-in rounded-sm group flex"
          variants={itemVariants}
          onClick={() => openLightbox(filteredIndex)}
          onMouseEnter={() => preloadImage(gallery.url)}
        >
          <Image
            src={gallery.url}
            alt={`Gallery Row ${rowIndex} - ${gallery.id}`}
            width={800}
            height={800}
            sizes="(max-height: 800px) 25vh, 33vw"
            quality={75}
            className="h-full w-auto max-w-none object-contain transition-all duration-500 group-hover:scale-105"
          />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="w-full flex flex-col gap-4 pb-8">
      {renderRow(row1, 1)}
      {row2.length > 0 && renderRow(row2, 2)}
    </div>
  );
}

function MasonryGallery({
  items,
  openLightbox,
  preloadImage,
}: {
  items: { gallery: GalleryType; filteredIndex: number }[];
  openLightbox: (index: number) => void;
  preloadImage: (src: string) => void;
}) {
  return (
    <div className="columns-2 gap-3 space-y-3 pb-20">
      {items.map(({ gallery, filteredIndex }) => (
        <motion.div
          key={gallery.id}
          className="relative group overflow-hidden cursor-zoom-in rounded-sm break-inside-avoid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          variants={itemVariants}
          onClick={() => openLightbox(filteredIndex)}
          onMouseEnter={() => preloadImage(gallery.url)}
        >
          <Image
            src={gallery.url}
            alt={`Gallery - ${gallery.id}`}
            width={800}
            height={800}
            sizes="(max-width: 768px) 50vw, 33vw"
            quality={75}
            className="w-full h-auto transition-all duration-500 group-hover:scale-105"
          />
        </motion.div>
      ))}
    </div>
  );
}
