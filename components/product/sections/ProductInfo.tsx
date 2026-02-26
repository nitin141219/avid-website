"use client";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef } from "react";
import { getResponsiveImageSources } from "@/lib/utils";
import { ProductPageData } from "../data";
import ImageSlideshow from "./ImageSlideshow";

function ProductInfo({
  data,
  slideshowImages,
  t,
}: {
  data: ProductPageData["information"];
  slideshowImages?: string[];
  t: any;
}) {
  const ref = useRef(null);
  const imageSource = getResponsiveImageSources(data as any);
  const resolvedImages = slideshowImages?.length ? slideshowImages : data?.images || [];
  const hasMultipleImages = resolvedImages.length > 1;
  const hasSingleImage = resolvedImages.length === 1;
  const isInView = useInView(ref, {
    once: true,
  });
    const tRoot = useTranslations("product");
  return (
    <div className="bg-gray-section" ref={ref}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="items-start lg:items-center gap-8 lg:gap-16 grid lg:grid-cols-2 pt-4 lg:pt-0 pb-6 lg:pb-0 container-inner"
      >
        {/* Left Content */}
        <div>
          {data?.title?.type === "icon" ? (
            <div
              className="w-[250px] h-[50px] relative"
              style={{ marginBottom: data?.title?.gapPx ?? 24 }}
            >
              <Image
                width={250}
                height={50}
                quality={100}
                src={data?.title?.src}
                alt={`${data?.title?.src || 'Product'} - Avid Organics specialty chemical identifier`}
                className={data?.title?.className || "object-contain"}
                priority
                sizes="250px"
              />
            </div>
          ) : (
            <h2 className="mb-2 font-black text-[55px] text-off-black">{data?.title?.src}</h2>
          )}
          {data?.subText && <h3 className="font-bold text-off-black">{t(data?.subText)}</h3>}
          <div className="bg-light-dark mt-2 mb-3 w-12 h-px" />
          {data?.description && (
            <p className="font-medium text-medium-dark leading-relaxed">{t(data?.description)}</p>
          )}

          {/* Chemical Info Section */}
          {(data?.casNumber || data?.molecularFormula || data?.molecularWeight) && (
            <div className="mt-4 mb-2">
              {data.casNumber && (
                <div className="text-off-black">
                    <b>{tRoot('chemicalInfo.casNumber')}:</b> <span className="font-normal">{data.casNumber}</span>
                </div>
              )}
              {data.molecularFormula && (
                <div className="text-off-black">
                    <b>{tRoot('chemicalInfo.molecularFormula')}:</b> <span className="font-normal">{data.molecularFormula}</span>
                </div>
              )}
              {data.molecularWeight && (
                <div className="text-off-black">
                    <b>{tRoot('chemicalInfo.molecularWeight')}:</b> <span className="font-normal">{data.molecularWeight}</span>
                </div>
              )}
              {data.bioBasedContent && (
                <div className="text-off-black">
                  <b>{tRoot("chemicalInfo.bioBasedContent")}:</b>{" "}
                  <span className="font-normal">{t(data.bioBasedContent)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-120">
          {hasMultipleImages ? (
            <ImageSlideshow images={resolvedImages} />
          ) : hasSingleImage ? (
            <Image
              src={resolvedImages[0]}
              alt={`${data?.title?.src || "Product"} - Avid Organics pharmaceutical grade specialty chemical`}
              fill
              className="object-cover"
            />
          ) : (
            <>
              <Image
                src={imageSource.desktop}
                alt={`${data?.title?.src || "Product"} - Avid Organics pharmaceutical grade specialty chemical`}
                fill
                className="hidden md:block object-cover"
              />
              <Image
                src={imageSource.mobile}
                alt={`${data?.title?.src || "Product"} - Avid Organics pharmaceutical grade specialty chemical`}
                fill
                className="md:hidden object-cover"
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ProductInfo;
