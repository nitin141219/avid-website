"use client";

import MapPinIcon from "@/public/images/home/global-presence/map_pin.svg";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { memo, useCallback, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
const zoomScale = 1.5;
const pinPositions = {
  INDIA: { x: 72, y: 35 },
  EUROPE: { x: 53, y: 12 },
  AMERICA: { x: 18, y: 32 },
};
const regionData = {
  INDIA: {
    title: "Vadodara, India",
    companyName: "AVID ORGANICS PVT LTD",
    locations: [
      {
        label: "Corporate Office:",
        address: ["409/410 Sears Towers, Sevasi", "Vadodara – 391 101, Gujarat, India"],
      },
      // {
      //   label: "Manufacturing Unit:",
      //   address: ["409/410 Sears Towers, Sevasi", "Vadodara – 391 101, Gujarat, India"],
      // },
    ],
  },

  EUROPE: {
    title: "Maastricht, The Netherlands",
    companyName: "AVID ORGANICS",
    locations: [
      {
        label: "Regional Sales Office:",
        address: [
          // "Avid Organics Europe B.V.",
          "Avenue Ceramique 221",
          // "6221 KX Maastricht",
          // "The Netherlands",
          "Maastricht, The Netherlands",
        ],
      },
    ],
  },

  AMERICA: {
    title: "Texas, United States",
    companyName: "AVID ORGANICS AMERICA INC.",
    locations: [
      {
        label: "Regional Sales Office:",
        address: [
          // "Avid Organics America Inc.",
          "5021 Vernon Avenue S, #209",
          // "Edina, MN 55436-2102",
          // "United States",
          "Texas, United States",
        ],
      },
    ],
  },
};

function ZoomableMapSection({ activeRegion, setActiveRegion }: any) {
  const handleZoomTo = useCallback((ref: any, point: { x: number; y: number }, region: any) => {
    if (!ref) return;

    // zoom target scale

    ref.setTransform(
      -(point.x / 100) * ref.instance.contentComponent.clientWidth * (zoomScale - 1),
      -(point.y / 100) * ref.instance.contentComponent.clientHeight * (zoomScale - 1) + 60,
      zoomScale,
      500
    );
    setActiveRegion(region);
  }, [setActiveRegion]);

  return (
    <TransformWrapper
      minScale={1}
      maxScale={3}
      wheel={{ disabled: false }}
      doubleClick={{ disabled: true }}
      pinch={{ disabled: false }}
      // onInit={(ref: ReactZoomPanPinchRef) => {
      //   if (!ref) return;
      //   setTimeout(() => {
      //     ref.setTransform(
      //       -(pinPositions.INDIA.x / 100) *
      //         (ref?.instance?.contentComponent?.clientWidth || 1) *
      //         (zoomScale - 1),
      //       -(pinPositions.INDIA.y / 100) *
      //         (ref?.instance?.contentComponent?.clientHeight || 1) *
      //         (zoomScale - 1) +
      //         60,
      //       zoomScale,
      //       200
      //     );
      //   }, 100);
      // }}
    >
      {(utils) => (
        <div className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
          <TransformComponent>
            <div className="relative w-full">
              {/* WORLD MAP */}
              <Image
                src="/world-map.png"
                alt="World Map"
                width={2000}
                height={1000}
                className="w-full select-none pointer-events-none"
              />

              {/* PINS */}
              {Object.entries(pinPositions).map(([key, pos]) => (
                <button
                  key={key}
                  onClick={() => handleZoomTo(utils, pos, key)}
                  className={`absolute flex flex-col items-center text-xs font-semibold origin-center cursor-pointer transition-all duration-500 ${
                    activeRegion === key
                      ? "scale-150 text-primary"
                      : "text-gray-500 hover:scale-110 hover:text-primary"
                  }`}
                  style={{
                    top: `${pos.y}%`,
                    left: `${pos.x}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="mt-1 text-xs xl:text-sm 2xl:text-base">
                    {key === "EUROPE" ? "NETHERLANDS" : key === "AMERICA" ? "UNITED STATES" : key}
                  </span>
                  <MapPinIcon className="size-6 xl:size-8 2xl:size-10" />
                </button>
              ))}
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}

interface RegionDetailsProps {
  activeRegion: "INDIA" | "EUROPE" | "AMERICA";
}

function RegionDetails({ activeRegion }: RegionDetailsProps) {
  const region = regionData[activeRegion];

  return (
    <>
      <h3 className="text-primary font-bold mb-1 lg:text-lg max-sm:text-center">
        {region.title} <span className="text-light-dark max-sm:hidden">:</span>
      </h3>
      <h3 className="text-off-black font-bold mb-1 max-sm:text-center">{region.companyName}</h3>

      {region.locations.map((loc, i) => (
        <div key={i} className="max-sm:text-center">
          <div className="w-20 lg:w-30 h-px bg-light-dark mb-2 sm:mb-4 max-sm:mx-auto"></div>

          <p className="text-sm lg:text-base text-off-black font-bold leading-relaxed ">
            {loc.label}
          </p>

          <p className="text-sm lg:text-base text-medium-dark leading-relaxed">
            {loc.address.map((line, j) => (
              <span key={j}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      ))}
      <div className="mt-5 space-y-2 text-off-black">
        {activeRegion === "INDIA" && (
          <a
            href={`tel:+91-265-2370829`}
            className="flex items-center gap-2 hover:text-primary hover:underline transition font-medium"
          >
            <Phone size={20} /> +91-265-2370829
          </a>
        )}

        {/* Email Button with email */}
        <a
          href={`mailto:info@avidorganics.net`}
          target="_blank"
          className="flex items-center gap-2 hover:text-primary hover:underline transition font-medium"
        >
          <Mail size={20} /> info@avidorganics.net
        </a>
      </div>
    </>
  );
}

const ZoomableMapSectionMemo = memo(ZoomableMapSection);
const RegionDetailsMemo = memo(RegionDetails);

export default function GlobalPresence() {
  const [activeRegion, setActiveRegion] = useState<"EUROPE" | "INDIA" | "AMERICA">("INDIA");
  const t = useTranslations("global_presence");
  return (
    <section className="relative w-full container-inner pt-5 pb-16" id="global-presence">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mb-8 sm:mb-12 max-lg:text-center"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-primary">{t("title")}</h2>
        {/* <p className="text-off-black font-bold text-base md:text-lg mt-2">Our Global Footprint.</p> */}
        <p className="text-medium-dark font-medium mt-3 w-full sm:w-3/5 leading-relaxed text-xs xs:text-sm md:text-base max-lg:mx-auto">
          {t("subTitle")}
        </p>
      </motion.div>

      {/* Map Container */}
      <div className="flex gap-6 lg:gap-15 justify-between max-sm:flex-col-reverse">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative w-full h-full flex-auto aspect-video"
        >
          <ZoomableMapSectionMemo activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          key={activeRegion}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-left max-w-48 lg:max-w-xs w-full flex flex-col justify-center mx-auto"
        >
          <RegionDetailsMemo activeRegion={activeRegion} />
        </motion.div>
      </div>
    </section>
  );
}
