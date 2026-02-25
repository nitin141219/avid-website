"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { DOCUMENTS_SERVICES } from "@/services/admin/documents/documents.services";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/AvidToast";
import { CreateDocumentModal } from "./create-document-modal";
import { EditDocumentModal } from "./edit-document-modal";

export type Docuement = {
  _id: string;
  name: string;
  category: string;
  created_at: string;
  description: string;
  slug?: string;
  year?: string;
  document_year?: string;
  documentYear?: string;
  product_name?: string;
  productName?: string;
  product_slug?: string;
  productSlug?: string;
  document_type?: string;
  doc_type?: string;
  docType?: string;
  product?: {
    value?: string;
    label?: string;
  };
};

function DocumentList() {
  const [documentData, setDocumentData] = useState({ documents: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Docuement | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await DOCUMENTS_SERVICES.getDocuments();
      setDocumentData(data);
    } catch (error: any) {
      setDocumentData({ documents: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string, loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      const success = await DOCUMENTS_SERVICES.deleteDocument(documentId);

      if (success) {
        toast.success("Document deleted successfully");
        fetchDocuments();
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

  const columns: ColumnDef<Docuement>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return row?.original?.description || "-";
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return row?.original?.category || "-";
      },
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ row }) => {
        return row?.original?.year || row?.original?.document_year || row?.original?.documentYear || "-";
      },
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => {
        return (
          row?.original?.product_name ||
          row?.original?.productName ||
          row?.original?.product_slug ||
          row?.original?.productSlug ||
          "-"
        );
      },
    },
    {
      accessorKey: "document_type",
      header: "Type",
      cell: ({ row }) => {
        const type =
          row?.original?.document_type || row?.original?.doc_type || row?.original?.docType || "";

        return type ? String(type).toUpperCase() : "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 rounded-full"
              onClick={() => {
                setEditDocument(row?.original);
                setEditOpen(true);
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <ConfirmDialog
              title="Delete Document"
              description="Are you sure you want to delete this document?"
              confirmText="Delete"
              cancelText="Cancel"
              confirmButtonClassName="bg-destructive hover:bg-destructive/70"
              onConfirm={(loadingCallback: (state: boolean) => void) => {
                deleteDocument(row?.original?._id, loadingCallback);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Documents</h1>
        <div className="flex">
          <Button onClick={() => setOpen(true)}>
            <Upload className="size-4" />
            Upload Document
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={documentData?.documents}
        pagination={false}
        isLoading={loading}
      />
      <CreateDocumentModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          fetchDocuments();
        }}
      />
      <EditDocumentModal
        open={editOpen}
        documentData={editDocument}
        onClose={() => {
          setEditOpen(false);
          setEditDocument(null);
        }}
        onSuccess={() => {
          fetchDocuments();
        }}
      />
    </div>
  );
}

export default DocumentList;
