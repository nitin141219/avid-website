"use client";

import { DOCUMENT_CATEGORY } from "@/constants";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getUserHistoryKey } from "@/lib/downloadHistory";
import { downloadFn } from "@/lib/downloadFn";
import { PRODUCTS_SERVICES } from "@/services/admin/products/products.services";
import { Accordion } from "@radix-ui/react-accordion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "../AvidToast";
import { useAuth } from "../auth/auth-context";
import { DownloadCard } from "./DownloadCard";
import DownloadHeroSection from "./DownloadHeroSection";

const getCertificateYear = (certificate: any) =>
  String(
    certificate?.year ||
      certificate?.document_year ||
      certificate?.documentYear ||
      certificate?.meta?.year ||
      String(certificate?.slug || "").match(/-(\d{4})$/)?.[1] ||
      ""
  );

const getCertificateName = (certificate: any) => {
  const name = String(certificate?.name || "");
  // Remove the year suffix if it exists (e.g., "FDA Registration Certificate-2025" -> "FDA Registration Certificate")
  return name.replace(/-\d{4}$/, "");
};

const getDocType = (document: any) => {
  const explicitDocType = String(
    document?.document_type || document?.doc_type || document?.docType || ""
  )
    .trim()
    .toLowerCase();

  if (explicitDocType === "pds" || explicitDocType === "sds") {
    return explicitDocType;
  }

  const slug = String(document?.slug || "").toLowerCase();

  if (slug.endsWith("-pds")) {
    return "pds";
  }

  if (slug.endsWith("-sds")) {
    return "sds";
  }

  return "other";
};

const getProductSlug = (document: any) => {
  const productSlug =
    document?.product_slug || document?.productSlug || document?.product?.value || "";

  if (productSlug) {
    return String(productSlug);
  }

  const slug = String(document?.slug || "").toLowerCase();

  if (slug.endsWith("-pds") || slug.endsWith("-sds")) {
    return slug.replace(/-(pds|sds)$/i, "");
  }

  return slug;
};

const toTimestamp = (value: any) => {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const getDocumentTimestamp = (document: any) =>
  Math.max(
    toTimestamp(document?.updated_at),
    toTimestamp(document?.updatedAt),
    toTimestamp(document?.created_at),
    toTimestamp(document?.createdAt)
  );

const formatProductSegment = (segment: string) => {
  if (!segment) return "";
  if (/^\d+$/.test(segment)) return segment;
  if (/^[a-z]{1,2}$/i.test(segment)) return segment.toUpperCase();

  const compactAlphaNumeric = segment.match(/^([a-z]{1,3})(\d+)$/i);
  if (compactAlphaNumeric) {
    return `${compactAlphaNumeric[1].toUpperCase()}${compactAlphaNumeric[2]}`;
  }

  return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
};

const formatProductNameFromSlug = (slug: string) => {
  const segments = slug.split("-").filter(Boolean);
  const parts: string[] = [];

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const nextSegment = segments[index + 1];

    if (/^[a-z]{1,3}$/i.test(segment) && /^\d+$/.test(nextSegment || "")) {
      parts.push(`${segment.toUpperCase()}${nextSegment}`);
      index += 1;
      continue;
    }

    parts.push(formatProductSegment(segment));
  }

  return parts.join(" ");
};

const getProductNameFromDocumentName = (document: any, docType: string) => {
  const rawName = String(document?.name || "").trim();
  if (!rawName) return "";

  if (docType === "pds" || docType === "sds") {
    const cleaned = rawName
      .replace(
        /\s*[-–(]*\b(?:pds|sds|product data sheet|safety data sheet)\b\)?\s*$/i,
        ""
      )
      .trim();
    return cleaned || rawName;
  }

  return rawName;
};

const getProductName = (document: any, productSlug: string, docType: string) => {
  const documentName = getProductNameFromDocumentName(document, docType);
  if (documentName) {
    return documentName;
  }

  const productName =
    document?.product_name || document?.productName || document?.product?.label || "";

  if (productName) {
    return String(productName);
  }

  return formatProductNameFromSlug(productSlug);
};

function Downloads({ downloads }: any) {
  const initialProducts = downloads?.[DOCUMENT_CATEGORY.PRODUCT] || [];
  const certificates = downloads?.[DOCUMENT_CATEGORY.CERTIFICATE] || [];
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = useTranslations("downloads");
  const commonT = useTranslations("common");
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Load products from API/localStorage to get the latest names
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await PRODUCTS_SERVICES.getProducts();
        if (data.products && data.products.length > 0) {
          // Map the product data structure to match what we need
          setProducts(data.products);
        }
      } catch {
        // If API fails (for example 404 in environments without product APIs),
        // keep using products derived from downloads payload.
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const groupedProducts = useMemo(() => {
    const productMap = new Map<
      string,
      {
        id: string;
        name: string;
        description: string;
        documents: { id: string; label: string; slug: string; timestamp: number }[];
      }
    >();

    // Create a lookup map of product slug to latest name from PRODUCTS_SERVICES
    const productNameMap = new Map<string, string>();
    products.forEach((product: any) => {
      productNameMap.set(product.value, product.label);
    });

    initialProducts.forEach((productDoc: any) => {
      const productSlug = getProductSlug(productDoc);
      if (!productSlug) {
        return;
      }

      const docType = getDocType(productDoc);
      const label =
        docType === "pds"
          ? "Product Data Sheet (PDS)"
          : docType === "sds"
            ? "Safety Data Sheet (SDS)"
            : productDoc?.name || "Document";

      const existing = productMap.get(productSlug);

      if (!existing) {
        // Prefer document name saved from admin form; fallback to product service, then slug.
        const latestProductName =
          getProductName(productDoc, productSlug, docType) ||
          productNameMap.get(productSlug) ||
          formatProductNameFromSlug(productSlug);
        
        productMap.set(productSlug, {
          id: String(productDoc?._id || productSlug),
          name: latestProductName,
          description: productDoc?.description || "",
          documents: [
            {
              id: String(productDoc?._id || `${productSlug}-${label}`),
              label,
              slug: String(productDoc?.slug || ""),
              timestamp: getDocumentTimestamp(productDoc),
            },
          ],
        });
        return;
      }

      existing.documents.push({
        id: String(productDoc?._id || `${productSlug}-${label}-${existing.documents.length}`),
        label,
        slug: String(productDoc?.slug || ""),
        timestamp: getDocumentTimestamp(productDoc),
      });

      if (!existing.description && productDoc?.description) {
        existing.description = productDoc.description;
      }
    });

    return Array.from(productMap.values()).map((product) => ({
      ...product,
      documents: product.documents.sort((a, b) => {
        const typePriority = (label: string) => {
          const normalized = label.toUpperCase();
          if (normalized.includes("PDS")) return 1;
          if (normalized.includes("SDS")) return 2;
          return 3;
        };

        const typeDiff = typePriority(a.label) - typePriority(b.label);
        if (typeDiff !== 0) return typeDiff;
        if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp;
        return a.label.localeCompare(b.label);
      }),
    }));
  }, [products, initialProducts]);

  const groupedCertificates = useMemo(() => {
    const certMap = new Map<
      string,
      {
        id: string;
        name: string;
        description: string;
        versions: { id: string; year: string; slug: string }[];
      }
    >();

    certificates.forEach((certificate: any) => {
      const certName = getCertificateName(certificate); // Parse name to remove year suffix
      const year = getCertificateYear(certificate);
      const slug = String(certificate?.slug || "");

      const existing = certMap.get(certName);

      if (!existing) {
        certMap.set(certName, {
          id: String(certificate?._id || certName),
          name: certName,
          description: certificate?.description || "",
          versions: [
            {
              id: String(certificate?._id),
              year: year || "N/A",
              slug,
            },
          ],
        });
      } else {
        existing.versions.push({
          id: String(certificate?._id),
          year: year || "N/A",
          slug,
        });
      }
    });

    return Array.from(certMap.values()).map((cert) => ({
      ...cert,
      versions: cert.versions.sort((a, b) => {
        // Sort by year descending (latest first)
        const yearA = Number(a.year) || 0;
        const yearB = Number(b.year) || 0;
        return yearB - yearA;
      }),
    }));
  }, [certificates]);

  const checkAndDownload = async (
    slug: string,
    historyMeta?: { title?: string; productTitle?: string }
  ) => {
    if (!slug) return;

    if (isLoggedIn) {
      await downloadFn(slug, {
        userKey: getUserHistoryKey(user),
        title: historyMeta?.title,
        productTitle: historyMeta?.productTitle,
        pagePath: pathname || "/media/downloads",
      });
    } else {
      toast.info("Please login to access documents");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("pendingDownloadSlug", slug);
        window.sessionStorage.setItem(
          "pendingDownloadMeta",
          JSON.stringify({
            title: historyMeta?.title,
            productTitle: historyMeta?.productTitle,
            pagePath: pathname || "/media/downloads",
          })
        );
      }
      const returnTo = pathname || "/media/downloads";
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  };

  return (
    <>
      <DownloadHeroSection />
      <section className="py-16 container-inner">
        <div className="w-full max-w-5xl font-medium text-medium-dark">{t("description")}</div>
      </section>
      <section className="bg-gray-section mb-6 py-16">
        <div className="container-inner">
          <h2 className="mb-10 font-extrabold text-primary text-3xl">
            {t("products_and_solutions")}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="gap-x-16 gap-y-6 grid lg:grid-cols-2"
            defaultValue="item-1"
          >
            {groupedProducts?.length > 0 ? (
              groupedProducts?.map((product: any) => (
                <DownloadCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  onDownload={() => {
                    const defaultDocument = product.documents[0];
                    if (defaultDocument?.slug) {
                      checkAndDownload(defaultDocument.slug, {
                        title: defaultDocument.label,
                        productTitle: product.name,
                      });
                    }
                  }}
                  downloadLinks={product.documents
                    .filter((document: any) => document.slug)
                    .map((document: any) => ({
                      id: document.id,
                      label: document.label,
                      onDownload: () =>
                        checkAndDownload(document.slug, {
                          title: document.label,
                          productTitle: product.name,
                        }),
                    }))}
                />
              ))
            ) : (
              <p className="col-span-full my-10 text-muted-foreground text-center">{t("error")}</p>
            )}
          </Accordion>

          <h2 className="mt-16 mb-10 font-extrabold text-primary text-3xl">
            {t("certifications")}
          </h2>
          <Accordion
            type="single"
            collapsible
            className="gap-x-16 gap-y-6 grid lg:grid-cols-2"
            defaultValue="item-1"
          >
            {groupedCertificates?.length > 0 ? (
              groupedCertificates?.map((certGroup: any) => (
                <DownloadCard
                  key={certGroup.id}
                  id={certGroup.id}
                  name={certGroup.name}
                  description={certGroup.description}
                  onDownload={() => {
                    // Download the latest version by default
                    const latestVersion = certGroup.versions[0];
                    if (latestVersion?.slug) {
                      checkAndDownload(latestVersion.slug, {
                        title: `${certGroup.name} - ${latestVersion.year}`,
                        productTitle: certGroup.name,
                      });
                    }
                  }}
                  downloadLinks={certGroup.versions
                    .filter((version: any) => version.slug)
                    .map((version: any) => ({
                      id: version.id,
                      label: `${certGroup.name} - ${version.year}`,
                      onDownload: () =>
                        checkAndDownload(version.slug, {
                          title: `${certGroup.name} - ${version.year}`,
                          productTitle: certGroup.name,
                        }),
                    }))}
                />
              ))
            ) : (
              <p className="col-span-full my-10 text-muted-foreground text-center">{t("error")}</p>
            )}
          </Accordion>
        </div>
      </section>
    </>
  );
}

export default Downloads;
