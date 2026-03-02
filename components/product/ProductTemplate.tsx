"use client";

import { useTranslations } from "next-intl";
import { ProductPageData } from "./data";
import ProductGlobalCompliance from "./sections/GlobalCompliance";
import ProductPrimaryApplication from "./sections/PrimaryApplication";
import ProductHeroSection from "./sections/ProductHeroSection";
import ProductInfo from "./sections/ProductInfo";
import ProductSupplyChainExcellence from "./sections/SupplyChainExcellence";

export default function ProductTemplate({
  data,
  slideshowImages,
  isAvigaBioHp = false,
  useBioTheme = false,
  params,
}: {
  data: ProductPageData;
  slideshowImages?: string[];
  isAvigaBioHp?: boolean;
  useBioTheme?: boolean;
  params: { category: string; slug: string };
}) {
  const resolvedData: ProductPageData = isAvigaBioHp
    ? {
        ...data,
        information: {
          ...data.information,
          title: { type: "icon", src: "/images/product/avigabioHP70.webp", gapPx: 4 },
        },
        qualityInfo: {
          ...data.qualityInfo,
          otherStandards: [
            {
              id: 0,
              title: "qualityInfo.otherStandards.0.title",
              description: "qualityInfo.otherStandards.0.description",
            },
            {
              id: 1,
              title: "qualityInfo.otherStandards.1.title",
              description: "qualityInfo.otherStandards.1.description",
            },
          ],
        },
      }
    : data;

  const t = useTranslations("product." + params.category + "." + params.slug);
  const tWithVariant = t;

  return (
    <>
      <section>
        {/* Hero Section */}
        <ProductHeroSection
          data={resolvedData?.hero}
          t={tWithVariant}
        />
        <ProductInfo
          data={resolvedData?.information}
          slideshowImages={slideshowImages}
          t={tWithVariant}
        />
        <ProductPrimaryApplication
          data={resolvedData?.applications}
          t={tWithVariant}
          iconStyle={
            useBioTheme
              ? {
                  // Tints monochrome application icons to brand green (#159A46)
                  filter:
                    "brightness(0) saturate(100%) invert(43%) sepia(74%) saturate(670%) hue-rotate(96deg) brightness(95%) contrast(88%)",
                }
              : undefined
          }
        />
        <ProductGlobalCompliance data={resolvedData?.qualityInfo} t={tWithVariant} />
        <ProductSupplyChainExcellence
          data={resolvedData?.supplyChain}
          t={tWithVariant}
          useGreenButtons={useBioTheme}
        />
      </section>
    </>
  );
}
