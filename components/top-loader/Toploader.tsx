import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <>
      <NextTopLoader
        color="#1886b8"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
      />
    </>
  );
}
