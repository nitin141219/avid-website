import { permanentRedirect } from "next/navigation";

export default async function EventAliasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/media/events`);
}
