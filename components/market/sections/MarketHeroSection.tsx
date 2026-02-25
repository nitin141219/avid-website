"use client";

import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { getResponsiveImageSources } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MarketPageData } from "../data";

function MarketHeroSection({ data, t }: { data: MarketPageData["hero"]; t: any }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  const imageSource = getResponsiveImageSources(data as any);
  const isInView = useInView(ref, {
    once: true,
  });

  useEffect(() => {
    // Preload actual image
    const img = new Image();
    img.src = imageSource.desktop;
    img.onload = () => setLoaded(true);
    return () => {};
  }, [imageSource.desktop]);
  return (
    <div className="relative bg-gray-section overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-[26rem] sm:h-[34rem] lg:h-150 overflow-hidden"
      >
        {/* Desktop Background Image */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center bg-fixed"
          style={{
            backgroundImage: `url(${imageSource.desktop})`,
          }}
        />
        {/* Mobile Background Image */}
        <div
          className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${imageSource.mobile})`,
          }}
        />
        <DotsOverlay className="z-1 opacity-70" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-20 absolute inset-0 flex flex-col py-10 sm:py-16 text-left container-inner"
      >
        <div className={data.className}>
          <h1 className="font-extrabold text-primary text-3xl">{t(data.title)}</h1>
          <div className="bg-light-dark my-3 w-12 h-px"></div>
          <p className="max-w-3xl font-medium text-off-black">{t(data.subtitle)}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default MarketHeroSection;

// "use client";

// import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
// import { motion, useInView } from "framer-motion";
// import { useRef } from "react";
// import { MarketPageData } from "../data";

// function MarketHeroSection({ data, t }: { data: MarketPageData["hero"]; t: any }) {
//   const ref = useRef(null);
//   const isInView = useInView(ref, {
//     once: true,
//   });

//   return (
//     <div className="relative bg-gray-section overflow-hidden">
//       <motion.div
//         ref={ref}
//         initial={{ opacity: 0 }}
//         animate={isInView ? { opacity: 1 } : {}}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="relative w-full h-150 overflow-hidden"
//       >
//         {/* Desktop Background Image */}
//         <div
//           className="hidden md:block absolute inset-0 bg-cover bg-no-repeat bg-center bg-fixed"
//           style={{
//             backgroundImage: `url(${data.image.src})`,
//           }}
//         />
//         {/* Mobile Background Image */}
//         <div
//           className="md:hidden block absolute inset-0 bg-cover bg-no-repeat bg-center"
//           style={{
//             backgroundImage: `url(${data.imageMobile.src})`,
//           }}
//         />
//         <DotsOverlay className="z-1 opacity-70" />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={isInView ? { opacity: 1 } : {}}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="z-20 absolute inset-0 flex flex-col py-16 text-left container-inner"
//       >
//         <div className={data.className}>
//           <h1 className="font-extrabold text-primary text-3xl">{t(data.title)}</h1>
//           <div className="bg-light-dark my-3 w-12 h-px"></div>
//           <p className="max-w-3xl font-medium text-off-black">{t(data.subtitle)}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default MarketHeroSection;
