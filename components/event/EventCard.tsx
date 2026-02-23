"use client";

import { CalendarPlus } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

export default function EventCard({ post }: any) {
  const locale = useLocale();
  const tCommon = useTranslations("common");

  const rawStart = post.start_date || DateTime.now().toISO();
  const rawEnd = post.end_date || DateTime.now().toISO();

  const displayStart = DateTime.fromISO(rawStart).setLocale(locale).toFormat("LLL dd, yyyy");
  const displayEnd = DateTime.fromISO(rawEnd).setLocale(locale).toFormat("LLL dd, yyyy");

  return (
    <div className="flex flex-col bg-white shadow-sm p-6 border border-slate-200 rounded-sm w-full h-full">
      <div className="flex justify-between items-start mb-10">
        <span className="max-w-52 font-bold text-slate-900 text-sm line-clamp-1 tracking-tight">
          {post?.category}
        </span>
        <div className="text-slate-700 text-sm text-right leading-tight">
          {displayStart} -<br />
          {displayEnd}
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-bold text-slate-950 text-xl line-clamp-3 leading-tight">
          {post?.title}
        </h3>

        {post?.location && (
          <div className="text-slate-800 text-lg line-clamp-2 leading-snug">
            <p>{post?.location}</p>
          </div>
        )}

        {post?.ics && <AddToGoogleCalendar url={post?.ics} label={tCommon("add_to_calendar")} />}
      </div>
      {post?.hyper_link && (
        <div className="mt-10">
          <Link href={post?.hyper_link || ""} target="_blank">
            <Button>{tCommon("more_details") || "More details"}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

const AddToGoogleCalendar = ({ url, label }: { url: string; label: string }) => {
  const handleOnClick = () => {
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleOnClick}
      type="button"
      className="flex items-center gap-3 font-bold text-blue-700 hover:text-blue-800 text-sm transition-colors"
    >
      <CalendarPlus className="w-5 h-5" />
      {label}
    </button>
  );
};
