import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Avid Organics - Leading Specialty Chemicals Manufacturer",
    short_name: "Avid Organics",
    description:
      "Global leader in specialty chemicals and pharmaceutical ingredients. FSSAI, FDA & REACH certified. Manufacturing excellence since 1999.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e40af",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/A.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/A.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/A.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/logo-tagline.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    categories: ["business", "productivity", "medical"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    id: "/?source=pwa",
    display_override: ["window-controls-overlay", "standalone"],
    related_applications: [],
    prefer_related_applications: false,
  };
}
