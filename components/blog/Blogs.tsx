// import Pagination from "./Pagination";
import BlogList from "./BlogList";
import BlogsHeroSection from "./BlogsHeroSection";

function Blogs({ searchParams }: any) {
  return (
    <>
      <BlogsHeroSection />
      <BlogList searchParams={searchParams} />
    </>
  );
}

export default Blogs;
