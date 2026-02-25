"use client";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { getDownloadHistory, getUserHistoryKey } from "@/lib/downloadHistory";
import { downloadFn } from "@/lib/downloadFn";
import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";

const formatDateTime = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString();
};

export default function History() {
  const { user } = useAuth();
  const userKey = getUserHistoryKey(user);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const historyItems = useMemo(() => {
    if (!userKey) return [];
    return getDownloadHistory(userKey);
  }, [userKey]);

  const handleDownloadAgain = async (item: {
    slug: string;
    title: string;
    productTitle?: string;
    pagePath?: string;
  }) => {
    if (!item.slug || !userKey) return;

    setActiveSlug(item.slug);
    try {
      await downloadFn(item.slug, {
        userKey,
        title: item.title,
        productTitle: item.productTitle,
        pagePath: item.pagePath,
      });
    } finally {
      setActiveSlug(null);
    }
  };

  return (
    <section className="py-16 container-inner">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-extrabold text-primary text-2xl md:text-3xl">Download History</h1>
        <p className="mt-2 text-medium-dark text-sm md:text-base">
          Files you downloaded from product pages and downloads resources.
        </p>

        {historyItems.length === 0 ? (
          <div className="bg-gray-section mt-8 p-6 rounded-md">
            <p className="text-medium-dark text-sm md:text-base">
              No downloads found yet for this account.
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/media/downloads">Go to Downloads</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-gray-section mt-8 rounded-md overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b text-off-black text-sm font-bold">
              <p className="col-span-3">File</p>
              <p className="col-span-3">Product / Title</p>
              <p className="col-span-3">Page</p>
              <p className="col-span-2">Last Accessed</p>
              <p className="col-span-1"></p>
            </div>

            <div className="divide-y">
              {historyItems.map((item) => (
                <div key={item.id} className="grid md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 text-sm">
                  <p className="md:col-span-3 text-off-black font-medium break-words">{item.fileName}</p>
                  <div className="md:col-span-3">
                    <p className="text-off-black">{item.title}</p>
                    {item.productTitle ? (
                      <p className="text-light-dark text-xs mt-1 break-words">{item.productTitle}</p>
                    ) : null}
                  </div>
                  <div className="md:col-span-3">
                    {item.pagePath ? (
                      <Link href={item.pagePath} className="text-primary hover:underline break-all">
                        {item.pagePath}
                      </Link>
                    ) : (
                      <p className="text-light-dark">-</p>
                    )}
                  </div>
                  <p className="md:col-span-2 text-light-dark">{formatDateTime(item.downloadedAt)}</p>
                  <div className="md:col-span-1">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={() => handleDownloadAgain(item)}
                      disabled={activeSlug === item.slug}
                    >
                      {activeSlug === item.slug ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
