import { Suspense } from "react";
import EventList from "./EventList";
import EventsHeroSection from "./EventsHeroSection";

function EventListSkeleton() {
  return (
    <div className="bg-gray-100 my-8 sm:my-20 p-4 sm:p-10 container-inner">
      <div className="mb-8 ml-auto w-full max-w-xs h-12 bg-white animate-pulse" />
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="w-full aspect-[4/3] bg-white animate-pulse" />
            <div className="w-2/3 h-5 bg-white animate-pulse" />
            <div className="w-full h-4 bg-white animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Events({ searchParams }: any) {
  return (
    <>
      <EventsHeroSection />
      <Suspense fallback={<EventListSkeleton />}>
        <EventList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

export default Events;
