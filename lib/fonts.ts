import localFont from "next/font/local";

export const redHatDisplay = localFont({
  src: [
    {
      path: "../public/fonts/RedHatDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/RedHatDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/RedHatDisplay-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/RedHatDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-red-hat",
  display: "swap",
  preload: true,
});
