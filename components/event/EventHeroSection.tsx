"use client";

import { IMAGE_DIMENSION } from "@/constants";
import { getResponsiveImageSources } from "@/lib/utils";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import Image from "next/image";
import { useLocale } from "next-intl";
import { getLocalizedContent } from "@/lib/getLocalizedContent";

export default function EventHeroSection({ data }: any) {
  const locale = useLocale();
  const heroImage = getResponsiveImageSources(data);
  const date = data.published_at
    ? DateTime.fromISO(data.published_at).setLocale(locale).toFormat("DDD")
    : null;
  const title = getLocalizedContent(data, "title", locale);
  const subTitle = getLocalizedContent(data, "sub_title", locale);
  return (
    <section className="bg-white">
      <div className="py-10">
        <div className="mb-8">
          {/* Date */}
          <div className="py-2 w-max font-medium text-primary text-base">
            {date} {data?.author ? "| " + data?.author : ""}
          </div>
          {/* Title */}
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-3 font-extrabold text-primary text-3xl md:text-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-normal text-medium-dark text-base xl:text-xl"
          >
            {subTitle}
          </motion.p>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="parallax-hero relative bg-gray-100 mx-auto rounded-lg w-full h-full overflow-hidden"
          style={{
            maxWidth: IMAGE_DIMENSION.EVENT.width,
            maxHeight: IMAGE_DIMENSION.EVENT.height,
          }}
        >
          <Image
            src={heroImage.desktop}
            alt={title || "Event image"}
            width={IMAGE_DIMENSION.EVENT.width}
            height={IMAGE_DIMENSION.EVENT.height}
            sizes="(min-width: 768px) 1120px, 100vw"
            className="parallax-hero__image hidden md:block w-full object-cover will-change-transform"
          />
          <Image
            src={heroImage.mobile}
            alt={title || "Event image"}
            width={IMAGE_DIMENSION.EVENT.width}
            height={IMAGE_DIMENSION.EVENT.height}
            sizes="(max-width: 767px) 100vw, 1120px"
            className="parallax-hero__image md:hidden w-full h-full object-cover will-change-transform"
          />
        </motion.div>
      </div>
    </section>
  );
}

// "use client";

// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// export default function EventHeroSection({ data }: any) {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     // Preload actual image
//     const img = new Image();
//     img.src = data.image;
//     img.onload = () => setLoaded(true);
//     return () => {};
//   }, []);
//   return (
//     <div className="relative bg-gray-section overflow-hidden">
//       <motion.div
//         initial={false}
//         animate={{ opacity: 1 }}
//
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="relative w-full h-150 overflow-hidden"
//         style={{
//           //   backgroundImage: `url(/images/market/animal.webp)`,
//           backgroundImage: `url(${data?.image})`,
//           filter: loaded ? "blur(0px)" : "blur(12px)",
//           backgroundAttachment: "fixed",
//           backgroundPosition: "bottom",
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//         }}
//       >
//         {/* <DotsOverlay className="z-10 opacity-70" /> */}
//       </motion.div>

//       <motion.div
//         initial={false}
//         animate={{ opacity: 1 }}
//
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="z-20 absolute inset-0 flex flex-col py-16 text-left container-inner"
//       >
//         <div className="mt-auto">
//           <h1 className="font-extrabold text-primary text-3xl">{data?.title}</h1>
//           <div className="bg-light-dark my-3 w-12 h-px"></div>
//           <p className="max-w-3xl font-medium text-off-black">{data?.sub_title}</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
