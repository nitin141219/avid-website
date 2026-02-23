import { EventForm } from "@/components/admin/events/form/event-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ event_id: string; locale: string }>;
};

async function getEvent(id: string) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      redirect("/login");
    }

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/get-event/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/admin/events");
    }

    const data = await res.json();
    return data;
  } catch {
    redirect("/admin/events");
  }
}

export default async function EditEvent({ params }: Props) {
  const id = (await params).event_id;
  const eventData = await getEvent(id);

  return <EventForm eventId={id} eventData={eventData?.data || {}} />;
}
