"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SLIDESHOW_TRANSITION_SECONDS } from "@/constants/slideshow";

interface ImageSlideshowProps {
  images: string[];
}

const PRODUCT_SLIDESHOW_AUTOPLAY_MS = 3000;

export default function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    // Warm image cache to prevent stutter on mobile during slide changes.
    const preloaders = images.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });
    return () => {
      preloaders.length = 0;
    };
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, PRODUCT_SLIDESHOW_AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative w-full h-72 sm:h-96 lg:h-120 overflow-hidden">
        <Image
          src={images[0]}
          alt="Product image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <section className="relative w-full h-72 sm:h-96 lg:h-120 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            fadeout: { opacity: 0 },
          }}
          initial="initial"
          animate="animate"
          exit="fadeout"
          transition={{ duration: SLIDESHOW_TRANSITION_SECONDS, ease: "easeInOut" }}
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="bottom-4 left-1/2 z-20 absolute flex gap-3 -translate-x-1/2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 w-6 transition-all cursor-pointer duration-300 ${
              idx === index ? "bg-white/50 w-10" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
