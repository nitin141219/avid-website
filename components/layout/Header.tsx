"use client";

import { useHash } from "@/hooks/useHash";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItemType } from "@/lib/getNavItems";
import { cn, resolveMediaUrl } from "@/lib/utils";
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
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";

const AutoBreadcrumb = dynamic(() => import("@/components/auto-breadcrumb/AutoBreadCrumb"), {
  ssr: false,
});

const extractSpotlightItems = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.spotlights)) return payload.data.spotlights;
  if (Array.isArray(payload?.data?.spotlight)) return payload.data.spotlight;
  if (Array.isArray(payload?.spotlights)) return payload.spotlights;
  if (Array.isArray(payload?.spotlight)) return payload.spotlight;
  return [];
};

const EMPTY_SPOTLIGHTS: any[] = [];

export default function Header({
  navItems,
  initialSpotlights = EMPTY_SPOTLIGHTS,
}: {
  navItems: NavItemType[];
  initialSpotlights?: any[];
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [spotlights, setSpotlights] = useState(initialSpotlights);
  const [loading, setLoading] = useState(false);
  const [hasFetchedSpotlights, setHasFetchedSpotlights] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageFallbacks, setImageFallbacks] = useState<Record<string, true>>({});
  const spotlightRequestRef = useRef(false);

  const hash = useHash();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastToggleYRef = useRef(0);
  const lastDirectionRef = useRef<"up" | "down" | null>(null);
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
    if (typeof window === "undefined") return;

    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    const absDelta = Math.abs(delta);
    const y = Math.max(latest, 0);
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const nearTop = y < 10;
    const nearBottom = maxScroll > 0 && y >= maxScroll - 4;
    const direction = delta > 0 ? "down" : "up";

    if (absDelta < 2) return;
    if ((nearTop || nearBottom) && absDelta < 8) return;

    if (nearTop) {
      lastToggleYRef.current = y;
      lastDirectionRef.current = "up";
      setHidden(false);
      return;
    }

    if (nearBottom && direction === "down") return;

    if (lastDirectionRef.current !== direction) {
      lastDirectionRef.current = direction;
      lastToggleYRef.current = y;
      return;
    }
    if (Math.abs(y - lastToggleYRef.current) < 16) return;

    if (direction === "down" && !nearBottom) {
      lastToggleYRef.current = y;
      setHidden(true);
      return;
    }

    if (direction === "up") {
      lastToggleYRef.current = y;
      setHidden(false);
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSpotlights(initialSpotlights);
    setHasFetchedSpotlights(initialSpotlights.length > 0);
    setLoading(false);
    setImageFallbacks({});
  }, [initialSpotlights]);

  useEffect(() => {
    setImageFallbacks({});
  }, [
    spotlights.map((item: any) => `${item?._id || ""}:${item?.image || item?.image_mobile || item?.imageMobile || item?.mobileImage || ""}`).join("|"),
  ]);

  const fetchSpotlights = useCallback(async () => {
    if (hasFetchedSpotlights || spotlightRequestRef.current) return;
    spotlightRequestRef.current = true;

    setLoading(true);
    try {
      const res = await fetch("/api/get-spotlight", {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Failed to fetch spotlights");
        spotlightRequestRef.current = false;
        return;
      }

      setSpotlights(extractSpotlightItems(data));
      setHasFetchedSpotlights(true);
    } catch {
      setSpotlights([]);
      toast.error("Something went wrong. Please try again.");
      spotlightRequestRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [hasFetchedSpotlights]);

  useEffect(() => {
    if ((openMenu || mobileMenuOpen) && !hasFetchedSpotlights) {
      void fetchSpotlights();
    }
  }, [openMenu, mobileMenuOpen, fetchSpotlights, hasFetchedSpotlights]);

  useEffect(() => {
    return () => {
      clearCloseMenuTimeout();
    };
  }, [clearCloseMenuTimeout]);

  const sheetId = useId();
  const getSpotlightImage = (item: any) => {
    if (item?._id && imageFallbacks[item._id]) {
      return "/logo.png";
    }
    const url = item?.image || item?.imageMobile || item?.mobileImage || item?.image_mobile || "/logo.png";
    const resolved = resolveMediaUrl(url, "/logo.png");
    const version = item?.updated_at || item?.updatedAt || item?.created_at || item?.createdAt || "";

    if (!version || resolved.startsWith("/")) {
      return resolved;
    }

    const separator = resolved.includes("?") ? "&" : "?";
    return `${resolved}${separator}v=${encodeURIComponent(String(version))}`;
  };
  const fallbackSpotlights = [
    {
      _id: "fallback-spotlight-1",
      slug: "/media/news",
      title: t("spotlight.top_text"),
      type: "news",
      image: "/logo.png",
    },
    {
      _id: "fallback-spotlight-2",
      slug: "/media/news",
      title: t("spotlight.bottom_text"),
      type: "news",
      image: "/logo.png",
    },
  ];
  const renderedSpotlights = spotlights.length > 0 ? spotlights : fallbackSpotlights;

  return (
    <>
      <motion.header
        animate={hidden ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ willChange: "transform", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
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
                                {renderedSpotlights.map((i: any) => (
                                  <Link
                                    href={
                                      i?.slug?.startsWith?.("/")
                                        ? i.slug
                                        : i?.type === "news"
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
                                        unoptimized
                                        className="w-full h-full object-cover transition-all duration-300"
                                        sizes="300px"
                                        onError={() => {
                                          if (!i?._id) return;
                                          setImageFallbacks((current) =>
                                            current[i._id] ? current : { ...current, [i._id]: true }
                                          );
                                        }}
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
                  <Sheet modal={false} open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                        <MobileNavMenu
                          navItems={navItems as any}
                          onNavigate={() => setMobileMenuOpen(false)}
                        />
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="mb-3 font-semibold text-light-dark text-xs uppercase tracking-wide">
                          {t("spotlight.title")}
                        </h4>
                        {loading ? (
                          <div className="space-y-3">
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="rounded w-full h-28" />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {renderedSpotlights.slice(0, 3).map((i: any) => (
                              <SheetClose key={i?._id} asChild>
                                <Link
                                  href={
                                    i?.slug?.startsWith?.("/")
                                      ? i.slug
                                      : i?.type === "news"
                                        ? `/media/news/${i?.slug}`
                                        : `/media/events/${i?.slug}`
                                  }
                                  className="block"
                                >
                                  <p className="mb-2 text-sm font-semibold text-gray-700 line-clamp-2">
                                    {i?.title}
                                  </p>
                                  <div
                                    className="w-full overflow-hidden rounded"
                                    style={{ aspectRatio: "2/1" }}
                                  >
                                    <Image
                                      src={getSpotlightImage(i)}
                                      alt={i?.title || "Spotlight"}
                                      width={600}
                                      height={300}
                                      unoptimized
                                      className="w-full h-full object-cover"
                                      sizes="100vw"
                                      onError={() => {
                                        if (!i?._id) return;
                                        setImageFallbacks((current) =>
                                          current[i._id] ? current : { ...current, [i._id]: true }
                                        );
                                      }}
                                    />
                                  </div>
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        )}
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
