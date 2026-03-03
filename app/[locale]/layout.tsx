import { AuthProvider } from "@/components/auth/auth-context";
import { routing } from "@/i18n/routing";
import { getAuthUser } from "@/lib/auth";
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
    default: "Avid Organics | Leading Manufacturers of Specialty Chemicals",
    template: "%s | Avid Organics",
  },
  description:
    "Leading manufacturers of specialty chemicals and pharmaceutical ingredients. FSSAI, FDA & REACH certified. Serving India, USA, Europe since 1999. GMP, ISO, WHO-GMP certified.",
  keywords: [
    "specialty chemicals",
    "pharmaceutical ingredients",
    "chemical manufacturer",
    "FSSAI certified",
    "FDA approved",
    "REACH compliant",
    "GMP certified",
  ],
  authors: [{ name: "Avid Organics" }],
  creator: "Avid Organics",
  publisher: "Avid Organics",
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
    title: "Avid Organics | Leading Manufacturers of Specialty Chemicals",
    description:
      "Global leader in specialty chemicals and pharmaceutical ingredients. FSSAI, FDA & REACH certified since 1999.",
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
    title: "Avid Organics | Leading Manufacturers of Specialty Chemicals",
    description:
      "Global leader in specialty chemicals and pharmaceutical ingredients. FSSAI, FDA & REACH certified since 1999.",
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
  manifest: "/manifest.json",
  verification: {
    google: "LBEECIrf02cqeZZ6C79eZRMrwsqOnq72TD9kZ2Sq5FQ",
  },
  alternates: {
    canonical: "https://www.avidorganics.net",
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const loggedInUser = await getAuthUser();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${redHatDisplay.variable} font-sans antialiased`}>
        {gtmId ? (
          <>
            <Script id="gtm-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  analytics_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  wait_for_update: 500
                });
              `}
            </Script>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `}
            </Script>
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
          <AuthProvider user={loggedInUser?.data || null}>{children}</AuthProvider>
        </NextIntlClientProvider>
        <DeferredClientWidgets />
      </body>
    </html>
  );
}

