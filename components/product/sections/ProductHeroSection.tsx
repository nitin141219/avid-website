"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { MultilineText } from "@/components/MultilineText";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ProductPageData } from "../data";

function ProductHeroSection({
  data,
  t,
  heroBgColor,
}: {
  data: ProductPageData["hero"];
  t: any;
  heroBgColor?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
  });

  return (
    <div
      className="relative bg-primary overflow-hidden"
      ref={ref}
      style={heroBgColor ? { backgroundColor: heroBgColor } : undefined}
    >
      <DotsOverlay>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col py-16 md:h-80 text-left container-inner"
        >
          <div className="flex md:flex-row flex-col md:items-end gap-5 md:gap-20 mt-auto">
            <h1 className="font-extrabold text-white text-3xl">
              <MultilineText text={t(data?.title)} />
            </h1>
            <p className="mt-4 pt-4 md:pt-0 pl-0 md:pl-4 border-white border-t md:border-t-0 md:border-l max-w-100 h-fit text-white text-lg">
              {t(data?.subtitle)}
            </p>
          </div>
        </motion.div>
        <div className="bottom-0 absolute flex w-full">
          <div className="relative flex-1 bg-white py-3"></div>
          <div className="flex px-0 w-full container-inner">
            <div className="triangle-cut-left relative flex-[0_0_auto] bg-white py-3 pl-5 md:pl-8 lg:pl-17 clip-white-cut"></div>
            <div
              className="relative flex-1 bg-white py-3 clip-white-cut"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, 100% 100%, -5px 100%)" }}
            ></div>
          </div>
          {/* <div className="relative flex-1 bg-white py-3 border-white border-l"></div> */}
        </div>
      </DotsOverlay>
    </div>
  );
}

export default ProductHeroSection;
