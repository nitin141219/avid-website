"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { StatusToggle } from "@/components/status-toggle/status-toggle";
import { SwitchToggle } from "@/components/switch-toggle/switch-toggle";
import { PAGINATION_DATA } from "@/constants";
import { Link } from "@/i18n/navigation";
import { EVENTS_SERVICES } from "@/services/admin/events/events.services";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Event = {
  _id: string;
  title: string;
  slug: string;
  sub_title: string;
  published_at: string;
  content: string;
  category: string;
  start_date: string;
  end_date: string;
  author: string;
  is_active: boolean;
  spotlight: boolean;
};

function AdminEventList() {
  const [eventsData, setEventsData] = useState({ events: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);
  const locale = useLocale();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await EVENTS_SERVICES.getEvents({ limit, page });
      setEventsData(data);
    } catch (error: any) {
      setEventsData({ events: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (
    eventId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const success = await EVENTS_SERVICES.updateEventStatus(eventId, status);

      if (success) {
        toast.success("Event status updated successfully");
        fetchEvents();
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
    eventId: string,
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const data = await EVENTS_SERVICES.addSpotlight(eventId, status);

      if (data) {
        toast.success(data?.message || "Spotlight updated successfully!");
        fetchEvents();
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

  const deleteEvent = async (eventIds: string[], loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      const success = await EVENTS_SERVICES.deleteEvents(eventIds);

      if (success) {
        toast.success("Event deleted successfully");
        fetchEvents();
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

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return (
          <span className="max-w-80 text-ellipsis line-clamp-2">
            {row?.original?.category || "-"}
          </span>
        );
      },
    },
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
      accessorKey: "date",
      header: "Event Date Time",
      cell: ({ row }) => {
        const startDate = row?.original?.start_date
          ? DateTime.fromISO(row?.original?.start_date).toFormat("DDD")
          : "";
        const endDate = row?.original?.end_date
          ? DateTime.fromISO(row?.original?.end_date).toFormat("DDD")
          : "";
        return (
          <span className="max-w-80 text-ellipsis line-clamp-2">{`${startDate} - ${endDate}`}</span>
        );
      },
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
              updateEventStatus(row?.original?._id, !row?.original?.is_active, loadingCallback);
            }}
            activeTitle="Deactivate this event?"
            inactiveTitle="Activate this event?"
            activeDescription="This event will no longer be visible to the public."
            inactiveDescription="This event will be visible to the public."
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
              href={`/admin/events/edit/${row?.original?._id}`}
              className="flex justify-center items-center bg-primary rounded-full size-9 text-white"
            >
              <Pencil size={16} />
            </Link>
            <ConfirmDialog
              title="Delete Event"
              description="Are you sure you want to delete this event?"
              confirmText="Delete"
              cancelText="Cancel"
              confirmButtonClassName="bg-destructive hover:bg-destructive/70"
              onConfirm={(loadingCallback: (state: boolean) => void) => {
                deleteEvent([row?.original?._id], loadingCallback);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchEvents();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Events</h1>
        <div className="flex">
          <Link
            href="/admin/events/add"
            className="flex justify-between items-center gap-1 bg-primary hover:bg-primary/90 mt-auto px-4 py-2 w-max text-white text-sm"
          >
            <PlusIcon size={16} /> Add Event
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={eventsData?.events}
        pagination={eventsData?.pagination}
        onPageChange={(page, limit) => {
          setLimit(limit);
          setPage(page);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default AdminEventList;
