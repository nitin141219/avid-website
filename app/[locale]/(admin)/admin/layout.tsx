import { AuthProvider } from "@/components/auth/auth-context";
import AppSidebar from "@/components/admin/layout/AppSidebar";
import Topbar from "@/components/admin/layout/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getAuthUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const loggedInUser = await getAuthUser();

  return (
    <AuthProvider user={loggedInUser?.data || null}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          {/* App Sidebar Component */}
          <AppSidebar />
          {/* Main Content */}
          <div className="flex flex-1 min-w-0 flex-col relative">
            <div className="sticky top-0 z-30 bg-background">
              <Topbar />
            </div>
            <main className="flex-1 min-w-0 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
