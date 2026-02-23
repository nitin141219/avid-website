"use client";

import Image, { ImageProps } from "next/image";
import { buildImageAlt } from "@/lib/seo";

type SeoImageProps = ImageProps & {
  seoAlt?: string;
  includeKeywords?: boolean;
};

export default function SeoImage({ seoAlt, alt, includeKeywords = true, ...props }: SeoImageProps) {
  const altText = seoAlt || alt || "Avid Organics Product";
  const finalAlt = buildImageAlt(String(altText), includeKeywords);

  return <Image {...props} alt={finalAlt} />;
}
