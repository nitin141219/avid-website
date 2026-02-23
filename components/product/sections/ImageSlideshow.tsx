"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageSlideshowProps {
  images: string[];
}

export default function ImageSlideshow({ images }: ImageSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"image" | "text" | "fadeout">("image");
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => setPhase("text"), 300)
    );
    timers.push(
      setTimeout(() => setPhase("fadeout"), 2700)
    );
    timers.push(
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setPhase("image");
      }, 3000)
    );
    timeoutRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, [index, images.length]);

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
        />
      </div>
    );
  }

  return (
    <section className="relative w-full h-72 sm:h-96 lg:h-120 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          variants={{
            initial: { opacity: 0, scale: 1.1 },
            animate: { opacity: 1, scale: 1 },
            fadeout: { opacity: 0, scale: 0.9 },
          }}
          initial="initial"
          animate={phase === "fadeout" ? "fadeout" : "animate"}
          exit="fadeout"
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="bottom-4 left-1/2 z-20 absolute flex gap-3 -translate-x-1/2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              timeoutRef.current.forEach(clearTimeout);
              setIndex(idx);
              setPhase("image");
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
