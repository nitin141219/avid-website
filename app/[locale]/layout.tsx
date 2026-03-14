import { routing } from "@/i18n/routing";
import { redHatDisplay } from "@/lib/fonts";
import type { Metadata } from "next";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import DeferredClientWidgets from "./DeferredClientWidgets";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.avidorganics.net"),
  title: {
    default: "Glycine & Glycolic Acid Manufacturer | Avid Organics",
    template: "%s | Avid Organics",
  },
  description:
    "Manufacturer of glycine and glycolic acid with export supply, batch documentation, and technical support for pharma, personal care, food, and industry.",
  keywords: [
    "glycine manufacturer",
    "glycolic acid manufacturer",
    "specialty chemicals manufacturer",
    "pharmaceutical grade glycine",
    "cosmetic grade glycolic acid",
    "food grade glycine",
    "batch documentation",
    "technical support",
    "global distribution",
    "export-ready manufacturer",
    "FDA approved",
    "REACH compliant",
    "GMP certified chemicals",
  ],
  authors: [{ name: "Avid Organics Pvt. Ltd." }],
  creator: "Avid Organics Pvt. Ltd.",
  publisher: "Avid Organics Pvt. Ltd.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.avidorganics.net",
    siteName: "Avid Organics",
    title: "Glycine & Glycolic Acid Manufacturer | Avid Organics",
    description:
      "Manufacturer of glycine and glycolic acid with export supply, batch documentation, and technical support for pharma, personal care, food, and industry.",
    images: [
      {
        url: "/logo-tagline.png",
        width: 1200,
        height: 630,
        alt: "Avid Organics - Specialty Chemicals Manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@avid_organics",
    creator: "@avid_organics",
    title: "Glycine & Glycolic Acid Manufacturer | Avid Organics",
    description:
      "Manufacturer of glycine and glycolic acid with export supply, batch documentation, and technical support for pharma, personal care, food, and industry.",
    images: ["/logo-tagline.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/A.png", type: "image/png", sizes: "32x32" },
      { url: "/A.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/A.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/A.png"],
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "LBEECIrf02cqeZZ6C79eZRMrwsqOnq72TD9kZ2Sq5FQ",
  },
  category: "Manufacturing",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1e40af",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MWNTS7N9";
  const ahrefsAnalyticsKey =
    process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY || "+BQPSicnE4fbMeiKQnZ4UQ";

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              function loadGtm(){
                if (w.__avidGtmLoaded) return;
                w.__avidGtmLoaded = true;
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              }

              function deferLoad(){
                if ('requestIdleCallback' in w) {
                  w.requestIdleCallback(loadGtm, { timeout: 2500 });
                } else {
                  w.setTimeout(loadGtm, 2000);
                }
              }

              if ('PerformanceObserver' in w) {
                try {
                  var observer = new PerformanceObserver(function(list){
                    if (list.getEntries().length) {
                      observer.disconnect();
                      deferLoad();
                    }
                  });
                  observer.observe({ type: 'largest-contentful-paint', buffered: true });
                } catch (e) {
                  w.addEventListener('load', deferLoad, { once: true });
                }
              } else {
                w.addEventListener('load', deferLoad, { once: true });
              }

              w.addEventListener('load', function(){ w.setTimeout(loadGtm, 4000); }, { once: true });
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
        {ahrefsAnalyticsKey ? (
          <Script
            id="ahrefs-analytics"
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsAnalyticsKey}
            strategy="lazyOnload"
          />
        ) : null}
      </head>
      <body className={`${redHatDisplay.variable} font-sans antialiased`}>
        {gtmId ? (
          <>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        ) : null}
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
        <DeferredClientWidgets />
      </body>
    </html>
  );
}

