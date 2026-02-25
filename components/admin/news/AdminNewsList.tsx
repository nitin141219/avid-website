"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { StatusToggle } from "@/components/status-toggle/status-toggle";
import { SwitchToggle } from "@/components/switch-toggle/switch-toggle";
import { PAGINATION_DATA } from "@/constants";
import { Link } from "@/i18n/navigation";
import { NEWS_SERVICES } from "@/services/admin/news/news.services";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "@/components/AvidToast";

export type News = {
  _id: string;
  title: string;
  slug: string;
  sub_title: string;
  published_at: string;
  content: string;
  author: string;
  is_active: boolean;
  spotlight: boolean;
};

function AdminNewsList() {
  const [newsData, setNewsData] = useState({ news: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);
  const locale = useLocale();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await NEWS_SERVICES.getNews({ limit, page });
      setNewsData(data);
    } catch (error: any) {
      setNewsData({ news: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateNewsStatus = async (
    newsId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const success = await NEWS_SERVICES.updateNewsStatus(newsId, status);

      if (success) {
        toast.success("News status updated successfully");
        fetchNews();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      loadingCallback(false);
    }
  };

  const addSpotlightStatus = async (
    newsId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const data = await NEWS_SERVICES.addSpotlight(newsId, status);
      if (data) {
        toast.success(data?.message || "Spotlight updated successfully!");
        fetchNews();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      loadingCallback(false);
    }
  };

  const deleteNews = async (newsIds: string[], loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      const success = await NEWS_SERVICES.deleteNews(newsIds);

      if (success) {
        toast.success("News deleted successfully");
        fetchNews();
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      loadingCallback(false);
    }
  };

  const columns: ColumnDef<News>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        return <span className="max-w-80 text-ellipsis line-clamp-2">{row?.original?.title}</span>;
      },
    },
    {
      accessorKey: "sub_title",
      header: "Tagline",
      cell: ({ row }) => {
        return (
          <span className="max-w-50 text-ellipsis line-clamp-2">{row?.original?.sub_title}</span>
        );
      },
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "published_at",
      header: "Published At",
      cell: ({ row }) => {
        const date = row?.original?.published_at
          ? DateTime.fromISO(row?.original?.published_at).setLocale(locale).toFormat("DDD")
          : null;
        return date || "-";
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusToggle
            active={!!row?.original?.is_active}
            onConfirm={(loadingCallback: (state: boolean) => void) => {
              updateNewsStatus(row?.original?._id, !row?.original?.is_active, loadingCallback);
            }}
            activeTitle="Deactivate this news?"
            inactiveTitle="Activate this news?"
            activeDescription="This news will no longer be visible to the public."
            inactiveDescription="This news will be visible to the public."
            activeConfirmText="Deactivate"
            inactiveConfirmText="Activate"
          />
        );
      },
    },
    {
      accessorKey: "spotlight",
      header: "Spotlight",
      cell: ({ row }) => {
        return (
          <SwitchToggle
            active={!!row?.original?.spotlight}
            onChange={(checked, loadingCallback: (state: boolean) => void) => {
              addSpotlightStatus(row?.original?._id, checked, loadingCallback);
            }}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Link
              href={`/admin/news/edit/${row?.original?._id}`}
              className="flex justify-center items-center bg-primary rounded-full size-9 text-white"
            >
              <Pencil size={16} />
            </Link>
            <ConfirmDialog
              title="Delete News"
              description="Are you sure you want to delete this news?"
              confirmText="Delete"
              cancelText="Cancel"
              confirmButtonClassName="bg-destructive hover:bg-destructive/70"
              onConfirm={(loadingCallback: (state: boolean) => void) => {
                deleteNews([row?.original?._id], loadingCallback);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchNews();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">News</h1>
        <div className="flex">
          <Link
            href="/admin/news/add"
            className="flex justify-between items-center gap-1 bg-primary hover:bg-primary/90 mt-auto px-4 py-2 w-max text-white text-sm"
          >
            <PlusIcon size={16} /> Add News
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={newsData?.news}
        pagination={newsData?.pagination}
        onPageChange={(page, limit) => {
          setLimit(limit);
          setPage(page);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default AdminNewsList;
