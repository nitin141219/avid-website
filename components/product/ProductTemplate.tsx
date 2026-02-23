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
  params,
}: {
  data: ProductPageData;
  slideshowImages?: string[];
  params: { category: string; slug: string };
}) {
  const t = useTranslations("product." + params.category + "." + params.slug);

  return (
    <>
      <section>
        {/* Hero Section */}
        <ProductHeroSection data={data?.hero} t={t} />
        <ProductInfo data={data?.information} slideshowImages={slideshowImages} t={t} />
        <ProductPrimaryApplication data={data?.applications} t={t} />
        <ProductGlobalCompliance data={data?.qualityInfo} t={t} />
        <ProductSupplyChainExcellence data={data?.supplyChain} t={t} />
      </section>
    </>
  );
}
