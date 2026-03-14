"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomSelect from "../custom-select/CustomSelect";
import { Input } from "../ui/input";

export default function BlogFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  // const [category, setCategory] = useState(searchParams.get("category"));
  const [year, setYear] = useState(searchParams.get("year"));
  const tCommon = useTranslations("common");
  const debouncedSearch = useDebounce(search);

  function updateParams(key: string, value?: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Reset pagination on filter change
    params.delete("page");

    router.push(`?${params.toString()}`, { scroll: false });
  }

  // ---- sync state when URL changes ----
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    // setCategory(searchParams.get("category"));
    setYear(searchParams.get("year"));
  }, [searchParams]);

  useEffect(() => {
    updateParams("search", debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-end">
      <div className="relative flex items-center max-w-xs w-full">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          id="search"
          className="bg-gray-section border border-gray-section placeholder:text-light-dark placeholder:font-normal text-black pl-9 h-12"
          placeholder={tCommon("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* <CustomSelect
        placeholder="Categories"
        customStyles={{
          control: () => ({
            backgroundColor: "var(--gray-section)",
            height: 48,
            width: 150,
          }),
          placeholder: () => ({
            fontWeight: 400,
          }),
        }}
        value={
          category
            ? {
                value: category,
                label: category.replace("-", " "),
              }
            : null
        }
        isClearable
        options={blogCategories.map((cat) => ({
          value: cat.value,
          label: cat.value.replace("-", " "),
        }))}
        onChange={(option: any) => updateParams("category", option?.value)}
      /> */}
      <CustomSelect
        instanceId="blog-year-filter"
        placeholder={tCommon("year")}
        options={[
          { value: "2026", label: "2026" },
          { value: "2025", label: "2025" },
          { value: "2024", label: "2024" },
          { value: "2023", label: "2023" },
        ]}
        value={year ? { value: year, label: year } : null}
        onChange={(option: any) => updateParams("year", option?.value)}
        customStyles={{
          control: () => ({
            backgroundColor: "var(--gray-section)",
            height: 48,
            width: 120,
          }),
          placeholder: () => ({
            fontWeight: 400,
          }),
        }}
        isClearable
      />
    </div>
  );
}
