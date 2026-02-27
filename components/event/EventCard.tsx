"use client";

import { CalendarPlus } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

function buildGoogleCalendarUrl(post: any) {
  const title = post?.title?.trim();
  if (!title) return null;

  const startIso = post?.start_date || DateTime.now().toISO();
  const endIso = post?.end_date || startIso;

  const start = DateTime.fromISO(startIso).toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
  const end = DateTime.fromISO(endIso).toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
  });

  if (post?.location) params.set("location", post.location);
  if (post?.sub_title || post?.category) params.set("details", post?.sub_title || post?.category);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function EventCard({ post }: any) {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const rawCategory = (post?.category || post?.category_title || "").trim();
  const rawBoothOrSubTitle = (post?.sub_title || post?.subTitle || "").trim();
  const isVitafoodsEvent = (post?.title || "").toLowerCase().includes("vitafoods");
  const categoryLooksLikeBooth = /^booth\b/i.test(rawCategory);
  const category = isVitafoodsEvent && categoryLooksLikeBooth ? "Trade Fair" : rawCategory;
  const boothOrSubTitle =
    rawBoothOrSubTitle || (isVitafoodsEvent && categoryLooksLikeBooth ? rawCategory : "");

  const rawStart = post.start_date || DateTime.now().toISO();
  const rawEnd = post.end_date || DateTime.now().toISO();
  const addToCalendarUrl = post?.ics || buildGoogleCalendarUrl(post);

  const displayStart = DateTime.fromISO(rawStart).setLocale(locale).toFormat("LLL dd, yyyy");
  const displayEnd = DateTime.fromISO(rawEnd).setLocale(locale).toFormat("LLL dd, yyyy");

  return (
    <div className="flex flex-col bg-white shadow-sm p-6 border border-slate-200 rounded-sm w-full h-full">
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-52 space-y-1 tracking-tight">
          {category ? <p className="font-bold text-slate-900 text-sm line-clamp-1">{category}</p> : null}
          {boothOrSubTitle ? (
            <p className="font-semibold text-slate-800 text-base line-clamp-1">{boothOrSubTitle}</p>
          ) : null}
        </div>
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

        {addToCalendarUrl && (
          <AddToGoogleCalendar url={addToCalendarUrl} label={tCommon("add_to_calendar")} />
        )}
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
    link.target = "_blank";
    link.rel = "noopener noreferrer";
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

