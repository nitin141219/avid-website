"use client";
import { useAuth } from "@/components/auth/auth-context";
import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import { MultilineText } from "@/components/MultilineText";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getUserHistoryKey } from "@/lib/downloadHistory";
import { downloadFn } from "@/lib/downloadFn";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/AvidToast";
import { ProductPageData } from "../data";

const getDocTypeFromSlug = (slug: string) => {
  const normalized = String(slug || "").toLowerCase();
  if (normalized.endsWith("-pds")) return "pds";
  if (normalized.endsWith("-sds")) return "sds";
  return "";
};

const getProductSlugFromDoc = (document: any) => {
  const direct = String(document?.product_slug || document?.productSlug || "").toLowerCase();
  if (direct) return direct;

  const slug = String(document?.slug || "").toLowerCase();
  if (slug.endsWith("-pds") || slug.endsWith("-sds")) {
    return slug.replace(/-(pds|sds)$/i, "");
  }

  return "";
};

function ProductSupplyChainExcellence({
  data,
  t,
  useGreenButtons = false,
}: {
  data: ProductPageData["supplyChain"];
  t: any;
  useGreenButtons?: boolean;
}) {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [productDocuments, setProductDocuments] = useState<any[]>([]);
  const [activeDownloadSlug, setActiveDownloadSlug] = useState<string | null>(null);

  useEffect(() => {
    const loadProductDocuments = async () => {
      try {
        const res = await fetch("/api/downloads", { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        const docs = json?.data?.PRODUCT || [];
        setProductDocuments(Array.isArray(docs) ? docs : []);
      } catch {
        setProductDocuments([]);
      }
    };

    loadProductDocuments();
  }, []);

  const resolveDocumentSlug = (requestedSlug: string) => {
    if (!requestedSlug || !productDocuments.length) {
      return requestedSlug;
    }

    const normalizedRequested = requestedSlug.toLowerCase();
    const requestedType = getDocTypeFromSlug(normalizedRequested);
    const requestedProduct = normalizedRequested.replace(/-(pds|sds)$/i, "");

    const exactMatch = productDocuments.find(
      (doc: any) => String(doc?.slug || "").toLowerCase() === normalizedRequested
    );
    if (exactMatch?.slug) {
      return String(exactMatch.slug);
    }

    const typeAndProductMatch = productDocuments.find((doc: any) => {
      const docProduct = getProductSlugFromDoc(doc);
      const docType = getDocTypeFromSlug(String(doc?.slug || ""));
      return docProduct === requestedProduct && docType === requestedType;
    });
    if (typeAndProductMatch?.slug) {
      return String(typeAndProductMatch.slug);
    }

    const prefixMatch = productDocuments.find((doc: any) => {
      const docSlug = String(doc?.slug || "").toLowerCase();
      const docType = getDocTypeFromSlug(docSlug);
      return docType === requestedType && docSlug.startsWith(`${requestedProduct}-`);
    });
    if (prefixMatch?.slug) {
      return String(prefixMatch.slug);
    }

    return requestedSlug;
  };

  const checkAndDownload = async (slug: string) => {
    if (!slug) return;

    const resolvedSlug = resolveDocumentSlug(slug);

    setActiveDownloadSlug(slug);

    try {
      const buttonTitle = data?.buttons?.find((btn) => btn.slug === slug)?.label;
      const resolvedTitle = buttonTitle ? t(buttonTitle) : "Document";
      const resolvedProductTitle = data?.title ? t(data.title) : undefined;

      if (!isLoggedIn) {
        toast.info("Please login to access documents");
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("pendingDownloadSlug", resolvedSlug);
          window.sessionStorage.setItem(
            "pendingDownloadMeta",
            JSON.stringify({
              title: resolvedTitle,
              productTitle: resolvedProductTitle,
              pagePath: pathname || "/",
            })
          );
        }
        const returnTo = pathname || "/";
        router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      } else {
        await downloadFn(resolvedSlug, {
          userKey: getUserHistoryKey(user),
          title: resolvedTitle,
          productTitle: resolvedProductTitle,
          pagePath: pathname || "/",
        });
      }
    } finally {
      setActiveDownloadSlug(null);
    }
  };
  return (
    <div className="relative py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="container-inner"
      >
        <MultilineText
          as="h2"
          text={t(data?.title)}
          className="font-extrabold text-off-black text-2xl md:text-3xl"
        />
        <div className="bg-light-dark mt-3 mb-6 w-12 h-px"></div>
        <div className="gap-16 grid md:grid-cols-2 w-full">
          <div>
            <h3 className="mb-5 font-extrabold text-off-black text-xl leading-tight">
              {t(data?.subtitle)}
            </h3>
            <div className="w-full">
              <div className="flex flex-wrap gap-10">
                {data?.packagingOptions?.map((opt) => (
                  <div key={opt.id}>
                    <p className="font-light text-off-black text-4xl">
                      {opt.value}
                      <span className="text-sm">{t(opt.unit)}</span>
                    </p>
                    <MultilineText
                      as="p"
                      text={t(opt.texts)}
                      className="font-medium text-medium-dark text-sm"
                    />
                  </div>
                ))}
              </div>
              {data?.packagingText ? (
                <>
                  <div className="bg-light-dark my-2 w-12 h-px"></div>
                  <p className="font-medium text-medium-dark text-base">{t(data?.packagingText)}</p>
                </>
              ) : null}
            </div>
          </div>
          {data?.otherOptions?.map((opt) => (
            <div key={opt.id}>
              <h3 className="mb-5 font-extrabold text-off-black text-xl leading-tight">
                {t(opt.title)}
              </h3>
              <div className="max-w-80 font-medium text-medium-dark leading-relaxed">
                {t(opt.description)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-5 col-span-full mt-16">
          {data?.buttons?.map((btn) => {
            if (!btn?.label || !t.has(btn.label)) return null;

            return (
              <Button
                key={btn?.slug}
                variant="secondary"
                className={useGreenButtons ? "cta-green" : ""}
                onClick={() => checkAndDownload(btn?.slug)}
                disabled={activeDownloadSlug === btn?.slug}
              >
                {activeDownloadSlug === btn?.slug ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                {activeDownloadSlug === btn?.slug ? "Downloading..." : t(btn?.label)}
              </Button>
            );
          })}
          {data?.linkButtons?.map((btn) => (
            <Link
              key={btn?.link}
              href={btn?.link}
              className={
                "flex justify-between items-center px-4 py-2 text-white text-sm " +
                (useGreenButtons
                  ? "cta-green"
                  : "bg-secondary hover:bg-secondary/90")
              }
            >
              {t(btn?.label)}
            </Link>
          ))}
        </div>
      </motion.div>
      <div
        className={
          (data?.otherOptions && data?.otherOptions?.length > 0 ? "w-1/4" : "w-1/2") +
          " pl-10 h-3/5 absolute right-0 top-1/2 -translate-y-3/5 max-sm:hidden"
        }
      >
        <DotsOverlay opacity={0.7} />
      </div>
    </div>
  );
}

export default ProductSupplyChainExcellence;
