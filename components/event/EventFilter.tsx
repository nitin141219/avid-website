"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CustomSelect from "../custom-select/CustomSelect";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function EventFilter() {
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
    <div className="flex flex-wrap justify-end gap-2 mb-8">
      <div className="relative flex items-center w-full max-w-xs">
        <Search
          size={16}
          className="top-1/2 left-3 absolute text-muted-foreground -translate-y-1/2 pointer-events-none"
        />
        <Input
          id="search"
          className="bg-white pl-9 border border-gray-section h-12 placeholder:font-normal text-black placeholder:text-light-dark"
          placeholder={tCommon("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            className="top-1/2 right-2 absolute -translate-y-1/2"
            onClick={() => setSearch("")}
          >
            <X size={18} className="text-gray-600" />
          </Button>
        )}
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
            backgroundColor: "#fff",
            height: 48,
            width: 150,
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
