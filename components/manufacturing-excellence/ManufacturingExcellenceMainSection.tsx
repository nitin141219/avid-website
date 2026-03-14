"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { getResponsiveImageSources } from "@/lib/utils";
import DunsSeal from "./DunsSeal";

const excellences = [
  {
    key: "processTechnology",
    image: "/images/manufacturing-excellence/pt.webp",
  },
  {
    key: "researchDevelopment",
    image: "/images/manufacturing-excellence/rnd.webp",
  },
  {
    key: "supplyChainReliability",
    image: "/images/manufacturing-excellence/scr.webp",
  },
  {
    key: "qualityControlAssurance",
    image: "/images/manufacturing-excellence/qca.webp",
  },
];

export default function ManufacturingExcellenceMainSection() {
  const t = useTranslations("manufacturing-excellence");
  return (
    <div className="space-y-16 py-16 container-inner">
      {excellences.map((item) => {
        const imageSource = getResponsiveImageSources(item as any, item.image);

        return (
        <section
          className="group items-center grid md:grid-cols-2 bg-gray-section"
          key={item.key}
          id={item.key}
        >
          {/* Left Content */}
          <div className="relative order-0 group-even:order-1 w-full h-110">
            <Image
              src={imageSource.desktop}
              alt={t(`excellences.${item.key}.title`)}
              fill
              className="hidden md:block object-cover"
            />
            <Image
              src={imageSource.mobile}
              alt={t(`excellences.${item.key}.title`)}
              fill
              className="md:hidden object-cover"
            />
          </div>

          {/* Right Image */}
          <div className="md:p-16 px-4">
            <h2 className="font-extrabold text-off-black text-2xl">
              {t(`excellences.${item.key}.title`)}
            </h2>
            <div className="bg-light-dark mt-2 mb-5 w-12 h-px" />
            <p className="font-medium text-medium-dark leading-relaxed">
              {t(`excellences.${item.key}.description`)}
            </p>
          </div>
        </section>
      );
      })}
      <section className="bg-gray-section">
        <div className="z-0 relative bg-primary p-16 text-white">
          <Image
            src="/images/manufacturing-excellence/amd.webp"
            fill
            alt="Our Story"
            className="-z-1 absolute inset-0 object-cover"
            quality={100}
          />
          <div className="py-16">
            <h2 className="font-extrabold text-2xl whitespace-pre-line">
              {t("advancedManufacturing.title")}
            </h2>
            <div className="bg-white/60 mt-2 mb-5 w-12 h-px" />
            <p className="font-normal leading-relaxed">{t("advancedManufacturing.description")}</p>
          </div>
          <div className="py-16">
            <h2 className="font-extrabold text-2xl whitespace-pre-line">
              {t("qualitySafetyEnvironmental.title")}
            </h2>
            <div className="bg-white/60 mt-2 mb-5 w-12 h-px" />
            <p className="font-normal leading-relaxed">
              {t("qualitySafetyEnvironmental.description1")}
            </p>
            <p className="mt-5 font-normal leading-relaxed">
              {t("qualitySafetyEnvironmental.description2")}
            </p>
          </div>
        </div>
        <div className="p-16">
          <h3 className="font-extrabold text-off-black text-2xl whitespace-pre-line">
            {t("certifications.title")}
          </h3>
          <div className="bg-light-dark mt-2 mb-5 w-12 h-px" />
          <div className="flex flex-wrap items-center gap-2 my-8">
            {[
              { id: 1, src: "/images/sustainability/fssai.webp", size: "h-12" },
              { id: 2, src: "/images/sustainability/reach.webp", size: "h-22" },
              { id: 3, src: "/images/certificates/fdca.webp", size: "h-22" },
              { id: 4, src: "/images/certificates/esg.webp", size: "h-22" },
              { id: 5, src: "/images/footer/logo1.webp", size: "h-22" },
              { id: 6, src: "/images/sustainability/sgs14.webp", size: "h-22" },
              { id: 7, src: "/images/sustainability/sgs45.webp", size: "h-22" },
              { id: 8, src: "/images/footer/logo3.webp", size: "h-22" },
              { id: 9, src: "/images/footer/logo6.webp", size: "h-22" },
              { id: 10, src: "/images/sustainability/smeta.webp", size: "h-18" },
            ].map((i) => (
              <Image
                src={i.src}
                key={i.id}
                height={60}
                width={200}
                quality={100}
                className={"w-auto object-contain " + i.size}
                alt={i.src}
              />
            ))}
          </div>
          <div className="mt-8">
            <DunsSeal />
          </div>
        </div>
      </section>
    </div>
  );
}
