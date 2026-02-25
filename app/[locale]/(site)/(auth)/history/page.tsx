import History from "@/components/auth/history/History";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const loggedInUser = await getAuthUser();

  if (!loggedInUser?.data) {
    redirect("/login?returnTo=/history");
  }

  return <History />;
}
