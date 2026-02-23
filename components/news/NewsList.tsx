import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import NewsCard from "./NewsCard";
import NewsFilter from "./NewsFilter";
import NewsPagination from "./NewsPagination";

const PER_PAGE = 12;

type SearchParams = {
  page?: string;
  year?: string;
  search?: string;
  limit?: string;
};

export async function getCustomerNews(searchParams: SearchParams) {
  const locale = await getLocale();

  try {
    const params = new URLSearchParams({
      page: searchParams.page ?? "1",
      limit: searchParams.limit ?? PER_PAGE.toString(),
      year: searchParams.year ?? "",
      search: searchParams.search ?? "",
      locale,
    });
    const baseUrl = process.env.BACKEND_URL
      ? `${process.env.BACKEND_URL}/api/v1/customer/get-news`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/news`;

    const res = await fetch(`${baseUrl}?${params}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }

    const json = await res.json();

    return {
      news: json.data.news ?? [],
      pagination: json.data.pagination ?? {
        current_page: 1,
        total_page: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching news:", error);

    return {
      news: [],
      pagination: {
        current_page: 1,
        total_page: 1,
      },
    };
  }
}

export default async function NewsList({ searchParams }: any) {
  // const page = parseInt(searchParams.page) || 1;
  // const category = searchParams.category || "all";
  // const year = searchParams.year || "all";
  // const search = searchParams.search?.toLowerCase() || "";

  const { news, pagination } = await getCustomerNews(searchParams);
  const t = await getTranslations("news");

  // const filtered = blogs.filter((post) => {
  //   const matchCategory = category === "all" || post.category === category;

  //   const matchYear = year === "all" || post.published_at.startsWith(year);

  //   const matchSearch =
  //     !search ||
  //     post.title.toLowerCase().includes(search) ||
  //     post.content.toLowerCase().includes(search);

  //   return matchCategory && matchYear && matchSearch;
  // });

  // const totalPages = Math.ceil(filtered.length / PER_PAGE);
  // const currentPage = Math.min(page, totalPages || 1);
  // const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // const filtered = blogs.filter((post) => {
  //   const matchCategory = category === "all" || post.category === category;
  //   const matchYear = year === "all" || post.date.startsWith(year);
  //   return matchCategory && matchYear;
  // });

  // const totalPages = Math.ceil(filtered.length / perPage);
  // const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="py-16 container-inner">
      <NewsFilter />
      {news?.length === 0 ? (
        <p className="text-muted-foreground text-center">{t("error")}</p>
      ) : (
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((post: any) => (
            <NewsCard key={post?._id} post={post} />
          ))}
        </div>
      )}
      {/* <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div> */}
      <NewsPagination currentPage={pagination?.current_page} totalPages={pagination?.total_page} />
      {/* <BlogPagination currentPage={page} totalPages={totalPages} /> */}
    </div>
  );
}
