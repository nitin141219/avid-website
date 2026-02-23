"use client";
import { MultilineText } from "@/components/MultilineText";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductPageData } from "../data";

function ProductGlobalCompliance({ data, t }: { data: ProductPageData["qualityInfo"]; t: any }) {
  return (
    <div className="z-0 relative bg-gray-section py-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="container-inner"
      >
        {/* Top section */}
        <MultilineText
          text={t(data?.title)}
          as="h2"
          className="font-extrabold text-off-black text-2xl md:text-3xl"
        />
        <div className="bg-light-dark mt-3 mb-6 w-12 h-px"></div>
        <div className="gap-16 grid grid-cols-1 sm:grid-cols-2">
          <div>
            <h3 className="mb-5 font-extrabold text-off-black text-xl leading-tight">
              {t(data.subtitle)}
            </h3>
            <div className="flex flex-wrap items-center gap-8">
              {data?.manufacturingStandards?.map((i) => (
                <Image
                  src={i.src}
                  key={i.id}
                  height={60}
                  width={200}
                  quality={100}
                  className={"w-auto object-contain " + i.size}
                  alt={`${i.src.split('/').pop()?.split('.')[0] || 'Certification'} - Avid Organics compliance certification badge`}
                />
              ))}
            </div>
          </div>
          <div className="gap-16 grid lg:grid-cols-2">
            {data?.otherStandards?.map((item) => (
              <div key={item.id} className="flex flex-col items-start w-full">
                <h3 className="mb-5 font-extrabold text-off-black text-xl leading-tight">
                  {t(item.title)}
                </h3>
                <div className="font-medium text-medium-dark leading-relaxed">
                  {t(item.description)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductGlobalCompliance;
