"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { CircleArrowUp, FunnelX, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import JobsHeroSection from "./JobsHeroSection";

// ------------------ Types ------------------
type JobLocation = {
  id: number;
  name: string;
  city: string;
  state: string;
  countryCode: string;
  countryName: string;
};

type Job = {
  id: number;
  title: string;
  departmentId: number;
  departmentName: string;
  jobType: number;
  experience?: string;
  publishedSinceDays: number;
  jobLocations: JobLocation[];
};

// ------------------ Constants ------------------
const JOB_TYPE_MAP: Record<number, string> = {
  1: "part_time",
  2: "full_time",
};

// ------------------ Main Component ------------------
export default function Jobs({ jobs }: { jobs: Job[] }) {
  const [filters, setFilters] = useState({
    departmentIds: [] as number[],
    jobTypes: [] as number[],
    locationIds: [] as number[],
  });
  const [search, setSearch] = useState("");
  const tCommon = useTranslations("common");
  const t = useTranslations("careers.jobs");
  // -------- Available filter options --------
  const availableDepartments = useMemo(() => {
    return Array.from(
      new Map(
        jobs.map((j) => [j.departmentId, { id: j.departmentId, name: j.departmentName }])
      ).values()
    );
  }, [jobs]);

  const availableJobTypes = useMemo(() => {
    return Object.entries(JOB_TYPE_MAP).map(([key, label]) => ({
      id: Number(key),
      label: t(label),
    }));
  }, [t]);

  const availableLocations = useMemo(() => {
    const map: any = {};

    jobs.forEach((job) => {
      job.jobLocations.forEach((loc) => {
        if (!map[loc.countryCode]) {
          map[loc.countryCode] = {
            country: loc.countryName,
            locations: new Map(),
          };
        }
        map[loc.countryCode].locations.set(loc.id, loc);
      });
    });

    return Object.values(map).map((c: any) => ({
      country: c.country,
      locations: Array.from(c.locations.values()),
    }));
  }, [jobs]);

  // -------- Apply filters --------
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (
        search &&
        !(
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.departmentName.toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }
      if (filters.departmentIds.length && !filters.departmentIds.includes(job.departmentId))
        return false;

      if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) return false;

      if (filters.locationIds.length) {
        const jobLocIds = job.jobLocations.map((l) => l.id);
        if (!jobLocIds.some((id) => filters.locationIds.includes(id))) return false;
      }

      return true;
    });
  }, [jobs, filters, search]);

  // -------- Group by department --------
  const jobsByDepartment = useMemo(() => {
    return filteredJobs.reduce((acc: any, job) => {
      if (!acc[job.departmentName]) acc[job.departmentName] = [];
      acc[job.departmentName].push(job);
      return acc;
    }, {});
  }, [filteredJobs]);

  // -------- Helpers --------
  const toggleFilter = (key: keyof typeof filters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const toggleCountry = (countryLocations: JobLocation[]) => {
    setFilters((prev) => {
      const locationIds = countryLocations.map((l) => l.id);
      const allSelected = locationIds.every((id) => prev.locationIds.includes(id));

      return {
        ...prev,
        locationIds: allSelected
          ? prev.locationIds.filter((id) => !locationIds.includes(id))
          : Array.from(new Set([...prev.locationIds, ...locationIds])),
      };
    });
  };

  // ------------------ Render ------------------
  return (
    <>
      <JobsHeroSection />
      <div id="current-openings" className="py-16 pt-20 container-inner">
        <h2 className="mb-3 sm:mb-12 font-extrabold text-off-black text-2xl md:text-3xl text-center">
          {t("open_positions")}
        </h2>
        <div className="gap-8 grid md:grid-cols-[280px_1fr]">
          {/* Filters */}
          <div className="space-y-4 p-4 border h-fit">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center w-full max-w-xs">
                <Search
                  size={16}
                  className="top-1/2 left-3 absolute text-muted-foreground -translate-y-1/2 pointer-events-none"
                />
                <Input
                  id="search"
                  className="px-9 border border-border placeholder:font-normal text-black placeholder:text-light-dark"
                  placeholder={tCommon("search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <FunnelX
                size={20}
                className="hover:text-secondary cursor-pointer"
                onClick={() => {
                  setFilters({
                    departmentIds: [],
                    jobTypes: [],
                    locationIds: [],
                  });
                  setSearch("");
                }}
              />
            </div>
            <FilterAccordion title={t("department")} value="department">
              {availableDepartments.map((d) => (
                <Checkbox
                  key={d.id}
                  label={d.name}
                  checked={filters.departmentIds.includes(d.id)}
                  onChange={() => toggleFilter("departmentIds", d.id)}
                />
              ))}
            </FilterAccordion>

            <FilterAccordion title={t("location")} value="location">
              {availableLocations.map((c: any) => {
                const countryLocationIds = c.locations.map((l: JobLocation) => l.id);
                const allChecked = countryLocationIds.every((id: number) =>
                  filters.locationIds.includes(id)
                );

                return (
                  <div key={c.country} className="space-y-1">
                    <label className="flex items-center gap-2 w-fit font-medium text-off-black text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => toggleCountry(c.locations)}
                      />
                      {c.country}
                    </label>

                    <div className="space-y-1 pl-5">
                      {c.locations.map((l: JobLocation) => (
                        <Checkbox
                          key={l.id}
                          label={l.name}
                          checked={filters.locationIds.includes(l.id)}
                          onChange={() => toggleFilter("locationIds", l.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </FilterAccordion>

            <FilterAccordion title={t("job_type")} value="jobType">
              {availableJobTypes.map((t) => (
                <Checkbox
                  key={t.id}
                  label={t.label}
                  checked={filters.jobTypes.includes(t.id)}
                  onChange={() => toggleFilter("jobTypes", t.id)}
                />
              ))}
            </FilterAccordion>
          </div>
          {/* Jobs */}
          <div>
            {Object.entries(jobsByDepartment).map(([dept, deptJobs]: any) => (
              <section key={dept} className="mb-10">
                <h2 className="flex items-center gap-2 font-bold text-off-black text-2xl">
                  {dept}
                  <span className="bg-secondary px-2 py-1 rounded-full font-bold text-white text-sm">
                    {deptJobs.length} job{deptJobs.length > 1 ? "s" : ""}
                  </span>
                </h2>
                <div className="space-y-4 mt-4">
                  {deptJobs.map((job: Job) => (
                    <Link
                      key={job.id}
                      href={"https://avidorganics.keka.com/careers/jobdetails/" + job.id}
                      target="_blank"
                      className="group flex justify-between items-center p-4 border hover:border-secondary rounded-lg transition-all"
                    >
                      <div>
                        <h3 className="font-bold text-off-black group-hover:text-secondary">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-medium-dark text-sm">
                          {job.jobLocations[0]?.name ?? ""}{" "}
                          {job.jobLocations[0]?.name ? (
                            <span className="text-xl align-middle">•</span>
                          ) : (
                            ""
                          )}{" "}
                          {job.experience ?? ""}{" "}
                          {job.experience ? <span className="text-xl align-middle">•</span> : ""}{" "}
                          {t(JOB_TYPE_MAP[job.jobType])}
                        </p>
                        <p className="mt-1 text-light-dark text-xs">
                          {job.publishedSinceDays} {t("days_ago")}
                        </p>
                      </div>
                      <CircleArrowUp className="opacity-0 group-hover:opacity-100 fill-secondary stroke-white size-7 rotate-45" />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterAccordion({ title, value, children }: any) {
  return (
    <Accordion type="single" collapsible className="mb-0 border-0 rounded-lg">
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="px-0! py-3 font-medium text-off-black text-sm hover:no-underline cursor-pointer">
          {title}
        </AccordionTrigger>
        <AccordionContent className="space-y-2 px-4 pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Checkbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-start gap-2 w-fit text-off-black text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 cursor-pointer"
      />
      {label}
    </label>
  );
}
