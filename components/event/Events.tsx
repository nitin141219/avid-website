import EventList from "./EventList";
import EventsHeroSection from "./EventsHeroSection";

function Events({ searchParams }: any) {
  return (
    <>
      <EventsHeroSection />
      <EventList searchParams={searchParams} />
    </>
  );
}

export default Events;
