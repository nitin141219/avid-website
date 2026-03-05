"use client";

import Image from "next/image";
import { ReactNode, type CSSProperties } from "react";

type StickyParallaxSectionProps = {
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
  imageRight?: boolean;
  className?: string;
  sectionMinHeightVh?: number;
  parallaxMax?: number;
  stickyOffsetPx?: number;
};

export default function StickyParallaxSection({
  imageSrc,
  imageAlt,
  children,
  imageRight = false,
  className = "",
  sectionMinHeightVh = 220,
  parallaxMax = 44,
  stickyOffsetPx = 0,
}: StickyParallaxSectionProps) {
  return (
    <section
      className={`scroll-hero ${className}`.trim()}
      data-sticky-parallax-max={parallaxMax}
      style={
        {
          minHeight: `${sectionMinHeightVh}vh`,
          ["--scroll-hero-offset" as string]: `${stickyOffsetPx}px`,
        } as CSSProperties
      }
    >
      <div className="scroll-hero__track container-inner">
        {imageRight ? (
          <>
            <div className="scroll-hero__content-col">
              <div className="scroll-hero__content-inner">{children}</div>
            </div>
            <div className="scroll-hero__media-col">
              <div className="scroll-hero__sticky">
                <div className="scroll-hero__image-wrap">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 992px) 55vw, 100vw"
                    className="scroll-hero__image"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="scroll-hero__media-col">
              <div className="scroll-hero__sticky">
                <div className="scroll-hero__image-wrap">
                  <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 992px) 55vw, 100vw"
                    className="scroll-hero__image"
                  />
                </div>
              </div>
            </div>
            <div className="scroll-hero__content-col">
              <div className="scroll-hero__content-inner">{children}</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
