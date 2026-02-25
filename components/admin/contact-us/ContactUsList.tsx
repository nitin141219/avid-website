"use client";

import { DataTable } from "@/components/data-table/data-table";
import { PAGINATION_DATA } from "@/constants";
import { exportContactUsToExcel } from "@/lib/excelExport";
import { CONTACT_US_SERVICES } from "@/services/admin/contactus/contacts.service";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Eye } from "lucide-react";
import { DateTime } from "luxon";
import { useLocale } from "next-intl";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/AvidToast";

export type ContactUsType = {
  _id: string;
  first_name: string;
  last_name: string;
  company: string;
  country: string;
  preferred_contact_method: string[];
  phone_number: string;
  email: string;
  inquiry_type: string[];
  message: string;
  receive_updates: boolean;
  agree_to_privacy_policy: boolean;
  created_at: string;
  updated_at: string;
};

function ContactUsList() {
  const [contactUsData, setContactUsData] = useState({ contactUs: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);
  const locale = useLocale();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await CONTACT_US_SERVICES.getContactUs({ limit, page });
      setContactUsData(data);
    } catch (error: any) {
      setContactUsData({ contactUs: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleExportContactUs = async () => {
    setExportLoading(true);
    try {
      await exportContactUsToExcel(contactUsData?.contactUs || []);
      toast.success("Contact Us data exported to Excel successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export Contact Us data");
    } finally {
      setExportLoading(false);
    }
  };

  const columns: ColumnDef<ContactUsType>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row?.original?.created_at
          ? DateTime.fromISO(row?.original?.created_at).setLocale(locale).toFormat("DDD")
          : null;
        return date || "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Link
              href={`/admin/contact-us/view/${row?.original?._id}`}
              className="flex justify-center items-center bg-primary rounded-full size-9 text-white"
            >
              <Eye size={16} />
            </Link>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchDocuments();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Contact Us</h1>
        <button
          onClick={handleExportContactUs}
          disabled={exportLoading || !contactUsData?.contactUs?.length}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={18} />
          {exportLoading ? "Exporting..." : "Export to Excel"}
        </button>
      </div>
      <DataTable
        columns={columns}
        data={contactUsData?.contactUs}
        pagination={contactUsData?.pagination}
        onPageChange={(page, limit) => {
          setLimit(limit);
          setPage(page);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default ContactUsList;
