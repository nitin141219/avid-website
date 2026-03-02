import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { PUBLIC_PAST_FALLBACK_EVENTS } from "@/constants/public-event-fallbacks";
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

function isEventActive(event: any) {
  // Treat undefined as active to avoid hiding legacy records that do not send this field.
  return event?.is_active !== false;
}

function filterEventsByYearAndSearch(events: any[], selectedYear?: string, searchText?: string) {
  return events.filter((event: any) => {
    if (!isEventActive(event)) return false;

    const yearMatch =
      !selectedYear || selectedYear === "all"
        ? true
        : new Date(event?.start_date || "").getFullYear().toString() === selectedYear;
    const searchMatch = !searchText
      ? true
      : `${event?.title || ""} ${event?.category || ""} ${event?.location || ""}`
          .toLowerCase()
          .includes(searchText);

    return yearMatch && searchMatch;
  });
}

function eventKey(event: any) {
  return event?.slug || `${event?.title || ""}|${event?.start_date || ""}|${event?.location || ""}`;
}

function mergeFallbackPastEvents(events: any[]) {
  const now = Date.now();
  const hasPastEvent = events.some(
    (event: any) => new Date(event?.end_date || event?.start_date || 0).getTime() < now
  );

  if (hasPastEvent) return events;

  const map = new Map<string, any>();
  [...events, ...PUBLIC_PAST_FALLBACK_EVENTS].forEach((event) => {
    map.set(eventKey(event), event);
  });

  return Array.from(map.values());
}

function sortEventsByTimeline(events: any[]) {
  const now = Date.now();

  return [...events].sort((a, b) => {
    const aStart = new Date(a?.start_date || 0).getTime();
    const bStart = new Date(b?.start_date || 0).getTime();
    const aEnd = new Date(a?.end_date || a?.start_date || 0).getTime();
    const bEnd = new Date(b?.end_date || b?.start_date || 0).getTime();

    const aIsUpcomingOrOngoing = aEnd >= now;
    const bIsUpcomingOrOngoing = bEnd >= now;

    if (aIsUpcomingOrOngoing !== bIsUpcomingOrOngoing) {
      return aIsUpcomingOrOngoing ? -1 : 1;
    }

    if (aIsUpcomingOrOngoing) {
      return aStart - bStart;
    }

    return bEnd - aEnd;
  });
}

// Data Fetching Function
export async function getCustomerEvents(searchParams: SearchParams) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const currentPage = Number(searchParams.page ?? "1");
  const page = Number.isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;
  const currentLimit = Number(searchParams.limit ?? PER_PAGE.toString());
  const limit = Number.isNaN(currentLimit) || currentLimit < 1 ? PER_PAGE : currentLimit;
  const selectedYear = searchParams.year?.trim();
  const searchText = searchParams.search?.trim().toLowerCase();

  try {
    if (token && process.env.BACKEND_URL) {
      const adminParams = new URLSearchParams();
      adminParams.set("page", String(page));
      adminParams.set("limit", String(limit));

        const adminRes = await fetch(
          `${process.env.BACKEND_URL}/api/v1/admin/get-events?${adminParams.toString()}`,
          {
            cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (adminRes.ok) {
        const adminJson = await adminRes.json();
        const adminEvents = adminJson?.data?.events ?? [];
        const filtered = filterEventsByYearAndSearch(adminEvents, selectedYear, searchText);
        const withFallback = mergeFallbackPastEvents(filtered);
        const sorted = sortEventsByTimeline(withFallback);
        const now = Date.now();
        const upcoming = sorted.filter(
          (event: any) => new Date(event?.end_date || event?.start_date || 0).getTime() >= now
        );
        const past = sorted.filter(
          (event: any) => new Date(event?.end_date || event?.start_date || 0).getTime() < now
        );

        return {
          events: sorted,
          grouped: {
            upcoming,
            past,
          },
          pagination:
            adminJson?.data?.pagination ??
            ({
              current_page: page,
              total_page: 1,
              total_count: sorted.length,
              limit,
              has_next_page: false,
              has_prev_page: false,
            } as const),
        };
      }
    }

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("locale", locale);
    if (selectedYear && selectedYear !== "all") params.set("year", selectedYear);
    if (searchText) params.set("search", searchText);

    const baseUrl = process.env.BACKEND_URL
      ? `${process.env.BACKEND_URL}/api/v1/customer/get-events`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`;

    const res = await fetch(`${baseUrl}?${params}`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json = await res.json();

    const activeEvents = filterEventsByYearAndSearch(
      json.data?.events ?? [],
      selectedYear,
      searchText
    );
    const withFallback = mergeFallbackPastEvents(activeEvents);
    const sorted = sortEventsByTimeline(withFallback);
    const now = Date.now();
    const upcoming = sorted.filter(
      (event: any) => new Date(event?.end_date || event?.start_date || 0).getTime() >= now
    );
    const past = sorted.filter(
      (event: any) => new Date(event?.end_date || event?.start_date || 0).getTime() < now
    );

    return {
      events: sorted,
      grouped: {
        upcoming,
        past,
      },
      pagination:
        json?.data?.pagination ??
        ({
          current_page: page,
          total_page: 1,
          total_count: sorted.length,
          limit,
          has_next_page: false,
          has_prev_page: false,
        } as const),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      events: [],
      grouped: {
        upcoming: [],
        past: [],
      },
      pagination: { current_page: 1, total_page: 1 },
    };
  }
}

export default async function EventList({ searchParams }: { searchParams: SearchParams }) {
  const { events, grouped, pagination } = await getCustomerEvents(searchParams);

  const t = await getTranslations("events");
  const upcomingEvents = grouped?.upcoming ?? [];
  const pastEvents = grouped?.past ?? [];

  return (
    <div className="bg-gray-100 my-8 sm:my-20 p-4 sm:p-10 container-inner">
      <EventFilter />

      {events?.length === 0 ? (
        <div className="py-20 h-96 text-center">
          <p className="text-muted-foreground">{t("error") || "No events found."}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="mb-6 font-bold text-2xl text-slate-900">Upcoming Events</h2>
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((post: any) => (
                  <EventCard key={post?._id || post?.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section>
              <h2 className="mb-6 font-bold text-2xl text-slate-900">Past Events</h2>
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((post: any) => (
                  <EventCard key={post?._id || post?.id} post={post} />
                ))}
              </div>
            </section>
          )}
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
