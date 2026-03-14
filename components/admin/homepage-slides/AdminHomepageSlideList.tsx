"use client";

import { toast } from "@/components/AvidToast";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { StatusToggle } from "@/components/status-toggle/status-toggle";
import { PAGINATION_DATA } from "@/constants";
import { Link } from "@/i18n/navigation";
import { HOMEPAGE_SLIDES_SERVICES } from "@/services/admin/homepage-slides/homepage-slides.services";
import { HomepageSlide } from "@/types/homepage-slide";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

function AdminHomepageSlideList() {
  const [slidesData, setSlidesData] = useState({ slides: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await HOMEPAGE_SLIDES_SERVICES.getSlides({ limit, page });
      setSlidesData(data);
    } catch (error: any) {
      setSlidesData({ slides: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateSlideStatus = async (
    slideId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      await HOMEPAGE_SLIDES_SERVICES.updateSlideStatus(slideId, status);
      toast.success("Homepage slide status updated successfully");
      fetchSlides();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      loadingCallback(false);
    }
  };

  const deleteSlide = async (slideId: string, loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      await HOMEPAGE_SLIDES_SERVICES.deleteSlide(slideId);
      toast.success("Homepage slide deleted successfully");
      fetchSlides();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      loadingCallback(false);
    }
  };

  const columns: ColumnDef<HomepageSlide>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="max-w-80 line-clamp-2">{row?.original?.title}</span>,
    },
    {
      accessorKey: "cta_text",
      header: "CTA",
    },
    {
      accessorKey: "cta_link",
      header: "CTA Link",
      cell: ({ row }) => <span className="max-w-60 line-clamp-2">{row?.original?.cta_link}</span>,
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "align",
      header: "Align",
      cell: ({ row }) => {
        const value = row?.original?.align || "left";
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <StatusToggle
          active={!!row?.original?.is_active}
          onConfirm={(loadingCallback: (state: boolean) => void) => {
            updateSlideStatus(row?.original?._id, !row?.original?.is_active, loadingCallback);
          }}
          activeTitle="Deactivate this homepage slide?"
          inactiveTitle="Activate this homepage slide?"
          activeDescription="This slide will no longer appear on the homepage."
          inactiveDescription="This slide will appear on the homepage."
          activeConfirmText="Deactivate"
          inactiveConfirmText="Activate"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/homepage-slides/edit/${row?.original?._id}`}
            className="flex justify-center items-center bg-primary rounded-full size-9 text-white"
          >
            <Pencil size={16} />
          </Link>
          <ConfirmDialog
            title="Delete Homepage Slide"
            description="Are you sure you want to delete this homepage slide?"
            confirmText="Delete"
            cancelText="Cancel"
            confirmButtonClassName="bg-destructive hover:bg-destructive/70"
            onConfirm={(loadingCallback: (state: boolean) => void) => {
              deleteSlide(row?.original?._id, loadingCallback);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchSlides();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Homepage Slides</h1>
        <Link
          href="/admin/homepage-slides/add"
          className="flex justify-between items-center gap-1 bg-primary hover:bg-primary/90 mt-auto px-4 py-2 w-max text-white text-sm"
        >
          <PlusIcon size={16} /> Add Slide
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={slidesData?.slides}
        pagination={slidesData?.pagination}
        onPageChange={(nextPage, nextLimit) => {
          setLimit(nextLimit);
          setPage(nextPage);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default AdminHomepageSlideList;
