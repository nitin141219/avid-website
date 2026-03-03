"use client";

import { LOCALIZATION_LANGUAGE } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { Locale, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseMenuTimeout = () => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCanHover = () => setCanHover(mediaQuery.matches);

    updateCanHover();
    mediaQuery.addEventListener("change", updateCanHover);

    return () => {
      mediaQuery.removeEventListener("change", updateCanHover);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      clearCloseMenuTimeout();
    };
  }, []);

  function onSelectChange(lng: string) {
    const nextLocale = lng as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname: pathname, params: params },
        { locale: nextLocale }
      );
    });
    setIsOpen(false);
  }

  return (
    <motion.div
      ref={dropdownRef}
      className="group relative z-[200]"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => {
        if (!canHover) return;
        clearCloseMenuTimeout();
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        if (!canHover) return;
        clearCloseMenuTimeout();
        closeMenuTimeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 120);
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 font-medium text-sm uppercase transition-all duration-300 cursor-pointer",
          isOpen 
            ? "bg-white text-primary rounded-md rounded-b-none" 
            : "text-white hover:bg-white hover:text-primary rounded-md hover:rounded-b-none",
          isPending && "opacity-50 pointer-events-none"
        )}
      >
        {locale}
        <ChevronDownIcon size={14} />
      </button>
      <motion.div
        variants={{
          open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
          closed: { opacity: 0, height: "0", transition: { duration: 0.2 } },
        }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "top-full left-0 absolute bg-white shadow-2xl overflow-hidden w-full",
          isOpen ? "block" : "hidden"
        )}
      >
        <ul className="py-1 px-1">
          {LOCALIZATION_LANGUAGE.map((lan) => (
            <li key={lan.value}>
              <button
                onClick={() => onSelectChange(lan.value)}
                className={cn(
                  "w-full text-left px-2 py-1.5 text-sm uppercase cursor-pointer rounded-sm transition-colors",
                  locale === lan.value
                    ? "text-secondary font-bold"
                    : "text-medium-dark hover:text-secondary"
                )}
              >
                {lan.value}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
