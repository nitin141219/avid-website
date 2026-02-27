import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    qualities: [45, 60, 75],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      new URL("https://www.avidorganics.net/**"),
      new URL("https://api.avidorganics.net/**"),
    ],
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "framer-motion",
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*.:ext(png|jpg|jpeg|webp|avif|svg|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy media URLs
      { source: "/media/blogs", destination: "/media/blog", permanent: true },
      { source: "/blogs", destination: "/media/blog", permanent: true },
      { source: "/blog", destination: "/media/blog", permanent: true },
      { source: "/news", destination: "/media/news", permanent: true },
      { source: "/downloads", destination: "/media/downloads", permanent: true },
      // Locale-aware legacy media URLs
      { source: "/:locale(en|de|fr|es)/media/blogs", destination: "/:locale/media/blog", permanent: true },
      { source: "/:locale(en|de|fr|es)/blogs", destination: "/:locale/media/blog", permanent: true },
      { source: "/:locale(en|de|fr|es)/blog", destination: "/:locale/media/blog", permanent: true },
      { source: "/:locale(en|de|fr|es)/news", destination: "/:locale/media/news", permanent: true },
      { source: "/:locale(en|de|fr|es)/downloads", destination: "/:locale/media/downloads", permanent: true },
    ];
  },
};

const withMDX = createMDX({ extension: /\.(md|mdx)$/ });

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withMDX(nextConfig));
