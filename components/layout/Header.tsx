"use client";

import { useHash } from "@/hooks/useHash";
import { Link, usePathname } from "@/i18n/navigation";
import { NavItemType } from "@/lib/getNavItems";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDownIcon, ChevronRight, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { toast } from "@/components/AvidToast";
import DotsOverlay from "../dots-overlay/DotsOverlay";
import LangSwitcher from "../lang-switcher/LangSwitcher";
import MobileNavMenu from "../mobile-menu/MobileNavMenu";
import NavUser from "../nav-user/nav-user";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";

const AutoBreadcrumb = dynamic(() => import("@/components/auto-breadcrumb/AutoBreadCrumb"), {
  ssr: false,
});
export default function Header({ navItems }: { navItems: NavItemType[] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [spotlights, setSpotlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetchedSpotlights, setHasFetchedSpotlights] = useState(false);

  const hash = useHash();
  const [hidden, setHidden] = useState("0");
  const { scrollY } = useScroll();
  const [activeSub, setActiveSub] = useState<NonNullable<NavItemType["submenu"]>[number] | null>(
    null
  );
  const t = useTranslations("menu");
  const menusWithChildrens = navItems
    .filter((i) => i.submenu?.some((j) => j?.children?.length))
    .flatMap((o) => o.submenu);
  const activeChildren = menusWithChildrens.find((i) => pathname.includes(i?.href || ""));
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseMenuTimeout = useCallback(() => {
    if (closeMenuTimeoutRef.current) {
      clearTimeout(closeMenuTimeoutRef.current);
      closeMenuTimeoutRef.current = null;
    }
  }, []);

  const toggleDropdown = (menuName: string | null = null) => {
    setOpenMenu(menuName);
    setActiveSub(activeChildren || null);
  };

  const handleMenuHoverEnter = useCallback(
    (menuName: string) => {
      clearCloseMenuTimeout();
      toggleDropdown(menuName);
    },
    [activeChildren, clearCloseMenuTimeout]
  );

  const handleMenuHoverLeave = useCallback(() => {
    clearCloseMenuTimeout();
    closeMenuTimeoutRef.current = setTimeout(() => {
      toggleDropdown(null);
    }, 120);
  }, [activeChildren, clearCloseMenuTimeout]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // scroll down → hide
    if (latest > 150 && latest > previous) {
      setHidden("-100%");
    }
    // scroll up → show
    else {
      setHidden(latest > 150 ? "calc(-100% + 63px)" : "0");
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!openMenu || hasFetchedSpotlights) return;

    let isCancelled = false;

    (async function fetchSpotlights() {
      setLoading(true);
      try {
        const res = await fetch("/api/get-spotlight", {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data?.message || "Failed to fetch spotlights");
          return;
        }

        if (!isCancelled) {
          setSpotlights(data?.data || []);
          setHasFetchedSpotlights(true);
        }
      } catch {
        if (!isCancelled) {
          setSpotlights([]);
          toast.error("Something went wrong. Please try again.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [openMenu, hasFetchedSpotlights]);

  useEffect(() => {
    return () => {
      clearCloseMenuTimeout();
    };
  }, [clearCloseMenuTimeout]);

  const sheetId = useId();
  const getSpotlightImage = (item: any) =>
    item?.image || item?.imageMobile || item?.mobileImage || item?.image_mobile || "/logo.png";

  return (
    <>
      <motion.header
        animate={{ y: hidden }}
        transition={{ duration: 0.25 }}
        className="top-0 z-100 relative sticky bg-primary shadow-md border-white border-b w-full text-white"
      >
        <div className="relative z-10">
          <DotsOverlay>
            <div className="flex flex-col container-inner">
            <div className="flex flex-wrap justify-end items-center gap-x-3 gap-y-1 ml-auto pt-2 text-xs sm:text-sm">
              {mounted ? <NavUser /> : null}
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 font-medium text-white transition break-words whitespace-normal text-right sm:text-left"
              >
                {t("contact_us")}
              </Link>
              <LangSwitcher />
            </div>
            {/* Logo */}
            <div className="flex justify-between items-end mt-1 w-full">
              <Link href="/" aria-label="Home" className="flex items-center mb-1.5">
                <Image
                  src="/white-logo.png"
                  alt="Logo"
                  width={144}
                  height={40}
                  priority
                  className="w-30 min-w-26 lg:min-w-36 transition-all duration-300"
                />
              </Link>
              <nav className="hidden min-[1081px]:flex items-center gap-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    className="group"
                    initial="closed"
                    animate={openMenu === item.name ? "open" : "closed"}
                    onMouseEnter={() => handleMenuHoverEnter(item.name)}
                    onMouseLeave={handleMenuHoverLeave}
                  >
                    {/* PARENT LINK */}
                    {item?.isMenuClickable ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 group-hover:bg-white p-2 rounded-md rounded-b-none font-medium text-white group-hover:text-primary text-sm uppercase transition-all duration-300"
                        onClick={() => {
                          toggleDropdown(null);
                        }}
                      >
                        {item.name} <ChevronDownIcon size={16} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 group-hover:bg-white p-2 rounded-md rounded-b-none font-medium text-white group-hover:text-primary text-sm uppercase transition-all duration-300 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(openMenu === item.name ? null : item.name);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleDropdown(openMenu === item.name ? null : item.name);
                          }
                        }}
                      >
                        {item.name} <ChevronDownIcon size={16} />
                      </button>
                    )}
                    <RemoveScroll enabled={!!openMenu}>
                      <motion.div
                        variants={{
                          open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
                          closed: { opacity: 0, height: "0", transition: { duration: 0.2 } },
                        }}
                        transition={{ duration: 0.25 }}
                        className={cn(
                          "top-full left-0 absolute bg-white shadow-2xl w-screen overflow-hidden",
                          openMenu === item.name ? "block" : "hidden"
                        )}
                      >
                        <div className="gap-5 xl:gap-10 grid grid-cols-[1.5fr_2fr_1fr] pt-10 text-black container-inner">
                          <div className="pr-5 xl:pr-10 border-light-dark/50 border-r">
                            <h3 className="mb-8 font-semibold text-secondary text-3xl underline underline-offset-10">
                              {item.name}
                            </h3>
                            <p className="text-medium-dark text-sm">{item.description}</p>
                          </div>

                          {/* COLUMN 2 — LINKS */}
                          <div className="gap-5 xl:gap-10 grid grid-cols-2 border-light-dark/50 border-r">
                            <ul className="space-y-6 pr-5 xl:pr-10 border-light-dark/50 border-r">
                              {item.submenu?.map((sub) => {
                                const hasChildren = !!sub.children?.length;
                                if (hasChildren) {
                                  const isActiveLink = pathname.includes(sub.href);
                                  return (
                                    <li key={sub.name} className="group/item">
                                      <button
                                        type="button"
                                        onMouseEnter={() => setActiveSub(sub)}
                                        onClick={() => setActiveSub(sub)}
                                        className="w-full text-left cursor-pointer"
                                      >
                                        <div
                                        className={cn(
                                          "flex justify-between items-center font-medium text-medium-dark hover:text-secondary text-base",
                                          activeSub?.name === sub.name ? "text-secondary" : "",
                                          isActiveLink ? "text-secondary font-bold" : ""
                                        )}
                                      >
                                        {sub.name}
                                        <ChevronRight
                                          className={cn(
                                            "opacity-0 group-hover/item:opacity-100 min-w-4 size-4 transition-opacity duration-100",
                                            activeSub?.name === sub.name ? "opacity-100" : ""
                                          )}
                                        />
                                      </div>
                                      </button>
                                    </li>
                                  );
                                }
                                const isActiveLink = pathname + hash === sub.href;
                                return (
                                  <li key={sub.name}>
                                    <Link
                                      href={sub.href}
                                      className={cn(
                                        "group/item font-medium text-medium-dark hover:text-secondary text-base",
                                        isActiveLink ? "text-secondary font-bold" : ""
                                      )}
                                      onClick={() => {
                                        toggleDropdown(null);
                                      }}
                                    >
                                      <div className="flex justify-between items-center">
                                        {sub.name}{" "}
                                        <ChevronRight className="opacity-0 group-hover/item:opacity-100 min-w-4 size-4 transition-opacity duration-100" />
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                            <ul className="space-y-4 pr-5 xl:pr-10 border-light-dark/50 border-r">
                              {item.submenu?.map((sub) =>
                                sub?.children ? (
                                  <ul
                                    key={sub.name}
                                    className={cn(
                                      "space-y-6 w-full transition-all",
                                      activeSub?.name === sub.name ? "block" : "hidden"
                                    )}
                                  >
                                    {sub?.children?.map((child) => {
                                      const isActiveLink = pathname + hash === child.href;
                                      return (
                                        <li key={child.name} className="group/sub-item">
                                          <Link
                                            href={child.href}
                                            className={cn(
                                              "block font-medium text-medium-dark group-hover/sub-item:text-secondary text-base",
                                              isActiveLink ? "text-secondary font-bold" : ""
                                            )}
                                            onClick={() => {
                                              toggleDropdown(null);
                                            }}
                                          >
                                            <div className="flex justify-between items-center">
                                              {child.name}
                                              <ChevronRight className="opacity-0 group-hover/sub-item:opacity-100 min-w-4 size-4 transition-opacity duration-100" />
                                            </div>
                                          </Link>
                                        </li>
                                      );
                                    })}{" "}
                                  </ul>
                                ) : null
                              )}
                            </ul>
                          </div>
                          {/* COLUMN 3 — SPOTLIGHT (Images auto-align with header end based on grid layout) */}
                          <div className="flex flex-col">
                            {loading ? (
                              <div className="space-y-4">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="rounded-none w-full h-30" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="rounded-none w-full h-30" />
                              </div>
                            ) : (
                              <>
                                <h4 className="mb-6 font-semibold text-light-dark text-sm uppercase">
                                  {t("spotlight.title")}
                                </h4>
                                {spotlights?.map((i: any) => (
                                  <Link
                                    href={
                                      i?.type === "news"
                                        ? `/media/news/${i?.slug}`
                                        : `/media/events/${i?.slug}`
                                    }
                                    key={i?._id}
                                    onClick={() => {
                                      toggleDropdown(null);
                                    }}
                                    className="flex flex-col mb-4 last:mb-0 min-w-0"
                                  >
                                    <p className="mb-3 text-gray-700 text-sm font-semibold line-clamp-2 wrap-anywhere">
                                      {i?.title}
                                    </p>
                                    {/* Image container: Maintains 2:1 aspect ratio, auto-constrained by grid column width */}
                                    <div className="w-full overflow-hidden rounded" style={{ aspectRatio: "2/1" }}>
                                      <Image
                                        src={getSpotlightImage(i)}
                                        alt={i?.title || "Logo-Tagline"}
                                        width={300}
                                        height={150}
                                        className="w-full h-full object-cover transition-all duration-300"
                                        sizes="300px"
                                      />
                                    </div>
                                  </Link>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="relative mt-6 w-full h-10 sm:h-14">
                          <DotsOverlay />
                        </div>
                      </motion.div>
                    </RemoveScroll>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile (hamburger) */}
              <div className="min-[1081px]:hidden z-40 flex items-center mb-1.5">
                {mounted ? (
                  <Sheet modal={false}>
                    <SheetTrigger asChild>
                      <Button variant="link" className="p-0! size-10 cursor-pointer" aria-label="Open menu">
                        <Menu className="size-7 text-white" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="z-999 bg-white p-4 w-full max-w-xl overflow-y-auto">
                      <SheetTitle>
                        <Link href="/" aria-label="Home" className="flex items-center">
                          <Image
                            src="/logo.png"
                            alt="Logo"
                            width={144}
                            height={40}
                            className="transition-all duration-300"
                          />
                        </Link>
                      </SheetTitle>
                      <div className="mt-4">
                        <MobileNavMenu navItems={navItems as any} />
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <Button
                    variant="link"
                    className="p-0! size-10 cursor-pointer"
                    aria-label="Open menu"
                    disabled
                  >
                    <Menu className="size-7 text-white" />
                  </Button>
                )}
              </div>
            </div>
            </div>
          </DotsOverlay>
        </div>
      </motion.header>
      <AutoBreadcrumb />
    </>
  );
}
