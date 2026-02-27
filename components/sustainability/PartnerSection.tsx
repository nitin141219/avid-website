"use client";
import partnerImage from "@/public/images/sustainability/partner_bg.jpg";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const PartnerSection = () => {
  const t = useTranslations("Sustainability.Partner");
  return (
    <section>
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-full h-80 xl:h-110 overflow-hidden"
        >
          <Image
            src={partnerImage}
            alt="Performance and Reporting"
            fill
            className="object-cover"
            placeholder="blur"
            quality={100}
          />
        </motion.div>
        <div className="z-20 absolute inset-0 flex flex-col py-16 text-left container-inner">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-auto"
          >
            <h2 className="font-extrabold text-white text-3xl">
              {t.rich("title", {
                br: () => <br />,
              })}
            </h2>
          </motion.div>
        </div>
      </div>
      <div className="space-y-10 py-16 container-inner">
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-4 col-start-1 bg-primary hover:bg-primary/90 mt-0 mb-16 px-4 py-2 w-fit h-9 text-white transition"
        >
          {t("cta")} <MoveRight className="size-5" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
};

export default PartnerSection;
