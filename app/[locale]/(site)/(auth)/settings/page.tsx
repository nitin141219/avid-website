import Settings from "@/components/auth/settings/Settings";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const loggedInUser = await getAuthUser();

  if (!loggedInUser?.data) {
    redirect("/login?returnTo=/settings");
  }

  return <Settings />;
}
