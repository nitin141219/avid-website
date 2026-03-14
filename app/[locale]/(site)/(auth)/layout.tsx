import { AuthProvider } from "@/components/auth/auth-context";
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

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const loggedInUser = await getAuthUser();

  return <AuthProvider user={loggedInUser?.data || null}>{children}</AuthProvider>;
}
