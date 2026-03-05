import { permanentRedirect } from "next/navigation";

export default async function EventAliasDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  permanentRedirect(`/${locale}/media/events/${slug}`);
}
