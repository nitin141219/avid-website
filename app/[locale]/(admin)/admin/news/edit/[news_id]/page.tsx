import { NewsForm } from "@/components/admin/news/form/news-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ news_id: string; locale: string }>;
};

async function getNews(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      redirect("/login");
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/admin/news");
    }

    const data = await res.json();
    return data;
  } catch {
    redirect("/admin/news");
  }
}

export default async function EditNews({ params }: Props) {
  const id = (await params).news_id;
  const newsData = await getNews(id);

  return <NewsForm newsId={id} newsData={newsData?.data || {}} />;
}
