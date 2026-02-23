import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import EventCard from "./EventCard";
import EventFilter from "./EventFilter";
import EventPagination from "./EventPagination";

const PER_PAGE = 12;

type SearchParams = {
  page?: string;
  year?: string;
  search?: string;
  limit?: string;
};

// Data Fetching Function
export async function getCustomerEvents(searchParams: SearchParams) {
  const locale = await getLocale();

  try {
    const params = new URLSearchParams({
      page: searchParams.page ?? "1",
      limit: searchParams.limit ?? PER_PAGE.toString(),
      year: searchParams.year && searchParams.year !== "all" ? searchParams.year : "",
      search: searchParams.search ?? "",
      locale,
    });

    const baseUrl = process.env.BACKEND_URL
      ? `${process.env.BACKEND_URL}/api/v1/customer/get-events`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`;

    const res = await fetch(`${baseUrl}?${params}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json = await res.json();

    return {
      events: json.data?.events ?? [],
      pagination: json.data?.pagination ?? {
        current_page: 1,
        total_page: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      events: [],
      pagination: { current_page: 1, total_page: 1 },
    };
  }
}

export default async function EventList({ searchParams }: { searchParams: SearchParams }) {
  const { events, pagination } = await getCustomerEvents(searchParams);

  const t = await getTranslations("events");

  return (
    <div className="bg-gray-100 my-20 p-10 container-inner">
      <EventFilter />

      {events?.length === 0 ? (
        <div className="py-20 h-96 text-center">
          <p className="text-muted-foreground">{t("error") || "No events found."}</p>
        </div>
      ) : (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((post: any) => (
            <EventCard key={post?._id || post?.id} post={post} />
          ))}
        </div>
      )}

      {pagination?.total_page > 1 && (
        <div className="mt-12">
          <EventPagination
            currentPage={Number(pagination?.current_page)}
            totalPages={Number(pagination?.total_page)}
          />
        </div>
      )}
    </div>
  );
}
