"use client";
import { MultilineText } from "@/components/MultilineText";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductPageData } from "../data";

export default function ProductPrimaryApplication({
  data,
  t,
}: {
  data: ProductPageData["applications"];
  t: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="py-10 sm:py-16 container-inner"
    >
      <div className="w-full">
        <MultilineText
          text={t(data.title)}
          as="h2"
          className="font-extrabold text-off-black text-2xl md:text-3xl"
        />
        <div className="bg-light-dark my-3 w-12 h-px"></div>
      </div>
      {/* Features */}
      <div className="gap-8 sm:gap-16 grid grid-cols-1 sm:grid-cols-2 mt-8 sm:mt-16">
        {data?.items?.map((app) => (
          <div className="flex flex-col items-start w-full max-w-100" key={app?.id}>
            <div className="flex items-center gap-2">
              <div className="relative flex flex-[0_0_72px] justify-start items-center size-18">
                <Image src={app.icon} alt={app.title as string} fill className="object-contain" />
              </div>
              <MultilineText
                as="h3"
                text={t(app.title)}
                className="font-extrabold text-off-black text-xl leading-tight"
              />
            </div>
            <div className="my-4 border-light-dark border-t w-20"></div>
            <p className="font-medium text-medium-dark leading-relaxed">{t(app.description)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
