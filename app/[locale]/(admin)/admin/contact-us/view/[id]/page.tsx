import ViewContactUs from "@/components/admin/contact-us/ViewContactUs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getSingleContact(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      redirect("/login");
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-contact-us/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/admin/contact-us");
    }

    const data = await res.json();
    return data;
  } catch {
    redirect("/admin/contact-us");
  }
}

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSingleContact(id);

  return <ViewContactUs data={data?.data || {}} />;
}
