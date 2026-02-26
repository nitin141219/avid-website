"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useHash } from "@/hooks/useHash";
import { Link, usePathname } from "@/i18n/navigation";
import { HomeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {
  hideHome?: boolean;
};

const segmentToTranslationKey: Record<string, string> = {
  "about-us": "about",
  "login": "login",
  "settings": "profile",
  "signup": "sign_up",
  "reset-password": "reset_password",
  history: "submenu.history",
  "manufacturing-excellence": "submenu.manufacturing",
  "executive-leadership": "submenu.leadership",

  market: "markets",
  "animal-nutrition": "submenu.animal_nutrition",
  "food-and-beverages": "submenu.food_beverage",
  "industrial-and-specialty-applications": "submenu.industrial",
  "personal-care-and-cosmetics": "submenu.personal_care",
  pharmaceuticals: "submenu.pharma",

  product: "products",
  "aviga-bio-hp-70": "aviga_bio_hp",
  "aviga-hp-70": "aviga_hp",
  "alpha-hydroxy-acids": "products_alpha",
  "aviga-hp": "aviga_hp",
  "aviga-t": "aviga_t",

  "amino-acids": "products_amino",
  "avigly-hp": "avigly_hp",
  "avigly-t": "avigly_t",
  avitau: "avitau",

  "aromatic-and-fine-chemicals": "products_aromatic",
  avivan: "avivan",
  guaiacol: "guaiacol",

  "specialty-chemicals-and-intermediates": "products_specialty",
  "chlorhexidine-base": "chlorhexidine",
  mehq: "mehq",

  sustainability: "sustainability",
  "environmental-stewardship": "submenu.environmental",
  "social-responsibility": "submenu.social",
  "governance-product-stewardship": "submenu.governance",

  media: "media",
  news: "submenu.news",
  event: "submenu.events",
  blog: "submenu.blogs",
  downloads: "submenu.downloads",

  careers: "careers",
  life: "submenu.life",
  jobs: "submenu.jobs",

  "contact-us": "contact_us",
  "privacy-policy": "privacy_policy",
  "terms-and-conditions": "terms_of_use",
  "global-presence": "submenu.global_presence",
  "current-openings": "submenu.current_openings",
  researchDevelopment: "submenu.researchDevelopment",
  // Add more as needed
};
const TOKEN_ROUTES = ["reset-password"];

function toTitleCaseSegment(seg: string) {
  const s = decodeURIComponent(seg)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[#_]+/g, "")
    .trim();

  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

export default function AutoBreadcrumb({ hideHome = false }: Props) {
  const hash = useHash();
  const pathname = usePathname();
  const t = useTranslations("menu");
  if (!pathname) return null;
  const segments = pathname.split("/").filter(Boolean).filter((segment, index, arr) => {
    const isTokenRoute = TOKEN_ROUTES.includes(arr[0]);
    return !(isTokenRoute && index === arr.length - 1);
  });;
  const paths = segments.map((_, i) => "/" + segments.slice(0, i + 1).join("/"));

  const notClickables = [
    "product",
    "media",
    "market",
    "alpha-hydroxy-acids",
    "amino-acids",
    "aromatic-and-fine-chemicals",
    "specialty-chemicals-and-intermediates",
    "careers",
  ];

  if (segments.length <= 0 && !hash) return null;

  return (
    <div className="bg-white">
      <div className="container-inner py-2">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home / Site Name */}
            {!hideHome && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center gap-2 font-medium text-sm">
                      <HomeIcon className="size-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {(segments.length > 0 || hash) && <BreadcrumbSeparator />}
              </>
            )}

            {/* Main Path Segments */}
            {segments.map((seg, i) => {
              const label = segmentToTranslationKey[seg]
                ? t(segmentToTranslationKey[seg])
                : toTitleCaseSegment(seg);

              return (
                <React.Fragment key={seg + i}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className={
                        "text-sm capitalize " +
                        (!hash && segments.length - 1 === i
                          ? "text-off-black font-bold"
                          : "font-medium")
                      }
                    >
                      {notClickables.includes(seg) || (!hash && segments.length - 1 === i) ? (
                        <span>{label}</span>
                      ) : (
                        <Link href={paths[i]}>{label}</Link>
                      )}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {i < segments.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}

            {/* Hash/Anchor Breadcrumb */}
            {hash && (
              <>
                {segments.length > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-sm capitalize text-off-black font-bold">
                    <span>
                      {t(segmentToTranslationKey[hash.replace("#", "")]) ??
                        toTitleCaseSegment(hash)}
                    </span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
