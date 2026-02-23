"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { StatusToggle } from "@/components/status-toggle/status-toggle";
import { PAGINATION_DATA } from "@/constants";
import { Link } from "@/i18n/navigation";
import { BLOGS_SERVICES } from "@/services/admin/blogs/blogs.services";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  sub_title: string;
  published_at: string;
  content: string;
  author: string;
  is_active: boolean;
};

function AdminBlogList() {
  const [blogsData, setBlogsData] = useState({ blogs: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);
  const locale = useLocale();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await BLOGS_SERVICES.getBlogs({ limit, page });
      setBlogsData(data);
    } catch (error: any) {
      setBlogsData({ blogs: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateBlogStatus = async (
    blogId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const success = await BLOGS_SERVICES.updateBlogStatus(blogId, status);

      if (success) {
        toast.success("Blog status updated successfully");
        fetchBlogs();
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

  const deleteBlog = async (blogIds: string[], loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      const success = await BLOGS_SERVICES.deleteBlog(blogIds);

      if (success) {
        toast.success("Blog deleted successfully");
        fetchBlogs();
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

  const columns: ColumnDef<Blog>[] = [
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
              updateBlogStatus(row?.original?._id, !row?.original?.is_active, loadingCallback);
            }}
            activeTitle="Deactivate this blog?"
            inactiveTitle="Activate this blog?"
            activeDescription="This blog will no longer be visible to the public."
            inactiveDescription="This blog will be visible to the public."
            activeConfirmText="Deactivate"
            inactiveConfirmText="Activate"
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
              href={`/admin/blogs/edit/${row?.original?._id}`}
              className="flex justify-center items-center bg-primary rounded-full size-9 text-white"
            >
              <Pencil size={16} />
            </Link>
            <ConfirmDialog
              title="Delete Blog"
              description="Are you sure you want to delete this blog?"
              confirmText="Delete"
              cancelText="Cancel"
              confirmButtonClassName="bg-destructive hover:bg-destructive/70"
              onConfirm={(loadingCallback: (state: boolean) => void) => {
                deleteBlog([row?.original?._id], loadingCallback);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Blogs</h1>
        <div className="flex">
          <Link
            href="/admin/blogs/add"
            className="flex justify-between items-center gap-1 bg-primary hover:bg-primary/90 mt-auto px-4 py-2 w-max text-white text-sm"
          >
            <PlusIcon size={16} /> Add Blog
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={blogsData?.blogs}
        pagination={blogsData?.pagination}
        onPageChange={(page, limit) => {
          setLimit(limit);
          setPage(page);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default AdminBlogList;
