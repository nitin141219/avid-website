"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function GovernanceSection() {
  const t = useTranslations("Sustainability.Governance");
  return (
    <section
      className="z-0 relative bg-gray-section py-8 overflow-x-hidden"
      id="governance-product-stewardship"
    >
      <div className="top-0 -right-6 -z-1 absolute size-85">
        <Image src="/assets/svg/bg.svg" alt="footer-bg" fill priority />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="space-y-16 container-inner"
      >
        {/* Top section */}
        <div className="items-end lg:gap-16 grid grid-cols-1 lg:grid-cols-2">
          <div className="relative w-full h-120 overflow-hidden">
            <Image
              src="/images/sustainability/governal.jpg"
              alt="Governance & Product Stewardship"
              fill
              className="object-cover"
            />
          </div>
          <div className="py-16 w-full">
            <h2 className="font-extrabold text-off-black text-2xl md:text-3xl">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
          </div>
        </div>
        <div>
          <h3 className="font-extrabold text-off-black text-xl">{t("certifications_title")}</h3>
          <p className="font-medium text-medium-dark leading-relaxed">{t("certifications_desc")}</p>
          <div className="flex flex-wrap items-center gap-8 my-8">
            {[
              { id: 1, src: "/images/footer/logo1.png", size: "h-22" },
              { id: 2, src: "/images/sustainability/sgs14.png", size: "h-22" },
              { id: 3, src: "/images/sustainability/sgs45.png", size: "h-22" },
              { id: 4, src: "/images/footer/logo3.png", size: "h-22" },
              { id: 5, src: "/images/footer/logo6.png", size: "h-22" },
              { id: 6, src: "/images/sustainability/smeta.png", size: "h-18" },
              { id: 7, src: "/images/certificates/fdca.png", size: "h-22" },
              { id: 8, src: "/images/sustainability/fssai.png", size: "h-12" },
              { id: 9, src: "/images/sustainability/reach.png", size: "h-22" },
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
          {/* <p className="font-medium text-medium-dark leading-relaxed">
            These certifications reflect disciplined processes and a commitment to continual
            improvement.
          </p> */}
        </div>
      </motion.div>
    </section>
  );
}
