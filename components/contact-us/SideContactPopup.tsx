"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { SOCIAL_LINKS } from "@/config/socialLinks";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CustomIcon } from "../ui/custom-icon";

const socials = [
  {
    name: "linkedin",
    url: SOCIAL_LINKS.linkedin,
  },
  {
    name: "twitter",
    url: SOCIAL_LINKS.twitter,
  },
  {
    name: "facebook",
    url: SOCIAL_LINKS.facebook,
  },
  {
    name: "instagram",
    url: SOCIAL_LINKS.instagram,
  },
];

export default function SideContactPopup() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("menu");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 sm:top-1/4 sm:-translate-y-1/4 z-40">
      {/* --- WRAPPER WHERE BUTTON AND POPUP SHARE SAME POINT --- */}
      <div className="relative w-0 h-0 flex items-center justify-end">
        {/* ------------------------------ */}
        {/* Trigger Button (same Y as popup) */}
        {/* ------------------------------ */}
        <AnimatePresence>
          {!open && (
            <motion.div
              key="trigger"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0"
            >
              <Button
                onClick={() => setOpen(!open)}
                className="font-bold rotate-270 origin-top-right -translate-x-13 hover:bg-primary h-13 p-4! text-lg"
                style={{ boxShadow: "rgba(0,0,0,0.3) 0px 0px 38px, rgba(0,0,0,0.22) 0px 0px 12px" }}
              >
                {t("side_popup.title")}{" "}
                {open ? <ChevronDown className="size-6" /> : <ChevronUp className="size-6" />}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------ */}
        {/* Popup Panel (slides over button) */}
        {/* ------------------------------ */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="popup"
              ref={popupRef}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 w-72 bg-primary text-white p-5 clip-path-custom"
            >
              {/* Close Arrow */}

              <CardContent className="space-y-4 p-0">
                <div className="flex justify-between w-full">
                  <h2 className="text-xl font-bold">{t("side_popup.how_can_we_help")}</h2>
                  <button onClick={() => setOpen(false)} className=" text-white p-1 cursor-pointer">
                    <ChevronRight className="size-6" />
                  </button>
                </div>

                <Link
                  href="/contact-us"
                  onClick={() => setOpen(false)}
                  className="w-full font-bold text-base bg-white text-secondary px-4 py-3 inline-block text-center transition-all duration-500"
                >
                  {t("contact_us")}
                </Link>

                <Link
                  href="/#global-presence"
                  onClick={() => setOpen(false)}
                  className="w-full font-bold text-base border border-white hover:bg-white hover:text-secondary text-white px-4 py-3 inline-block text-center transition-all duration-500"
                >
                  {t("side_popup.our_locations")}
                </Link>

                <div>
                  <p className="font-bold text-lg mb-2">{t("side_popup.follow_us")}</p>
                  <div className="flex gap-3 mt-3 mx-1 justify-between">
                    {socials.map((social: any) => (
                      <Link
                        key={social?.name}
                        href={social?.url}
                        target="_blank"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center justify-center bg-white text-secondary w-11 h-8 transform skew-x-14"
                      >
                        <CustomIcon name={social?.name} className="w-5 h-5 transform -skew-x-14" />
                      </Link>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
