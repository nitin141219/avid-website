// import Pagination from "./Pagination";
import NewsHeroSection from "./NewsHeroSection";
import NewsList from "./NewsList";

function News({ searchParams }: any) {
  return (
    <>
      <NewsHeroSection />
      <NewsList searchParams={searchParams} />
    </>
  );
}

export default News;
