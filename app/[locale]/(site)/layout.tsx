import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getNavItems } from "@/lib/getNavItems";
import type { Metadata } from "next";
// const ParticleCursor = dynamic(() => import("@/components/cursor/ParticleCursor"));
import LazySideContactPopup from "@/components/contact-us/LazySideContactPopup";

export const metadata: Metadata = {
  title: "Avid Organics | Leading Manufacturers of Specialty Chemicals",
  description: "Leading Manufacturers of Specialty Chemicals",
};

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  return (
    <>
      <Header navItems={await getNavItems(locale)} />
      <main>
        <LazySideContactPopup />
        {children}
      </main>
      <div className="w-full h-10 sm:h-14 my-6 relative">
        <DotsOverlay opacity={0.7} />
      </div>
      <Footer />
    </>
  );
}
