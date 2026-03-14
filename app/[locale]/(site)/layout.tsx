import DotsOverlay from "@/components/dots-overlay/DotsOverlay";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getNavItems } from "@/lib/getNavItems";
import { getSpotlights } from "@/lib/home-data";
// const ParticleCursor = dynamic(() => import("@/components/cursor/ParticleCursor"));
import { AuthProvider } from "@/components/auth/auth-context";
import LazySideContactPopup from "@/components/contact-us/LazySideContactPopup";

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const [navItems, initialSpotlights] = await Promise.all([
    getNavItems(locale),
    getSpotlights(),
  ]);

  return (
    <AuthProvider user={null}>
      <>
        <Header navItems={navItems} initialSpotlights={initialSpotlights} />
        <main>
          <LazySideContactPopup />
          {children}
        </main>
        <div className="w-full h-10 sm:h-14 my-6 relative">
          <DotsOverlay opacity={0.7} />
        </div>
        <Footer />
      </>
    </AuthProvider>
  );
}
