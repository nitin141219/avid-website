import { Suspense } from "react";
// import Pagination from "./Pagination";
import NewsHeroSection from "./NewsHeroSection";
import NewsList from "./NewsList";

function NewsListSkeleton() {
  return (
    <div className="py-8 sm:py-16 container-inner">
      <div className="mb-8 ml-auto w-full max-w-xs h-12 bg-gray-100 animate-pulse" />
      <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="w-full aspect-[4/3] bg-gray-100 animate-pulse" />
            <div className="w-2/3 h-5 bg-gray-100 animate-pulse" />
            <div className="w-full h-4 bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function News({ searchParams }: any) {
  return (
    <>
      <NewsHeroSection />
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

export default News;
