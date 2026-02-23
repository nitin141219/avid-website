"use client";

import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { StatusToggle } from "@/components/status-toggle/status-toggle";
import { PAGINATION_DATA } from "@/constants";
import { exportUsersToExcel } from "@/lib/excelExport";
import { USER_SERVICES } from "@/services/admin/users/users.services";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  market_interest: string[];
  mobile_no: string;
  country: string;
  company_name: string;
  created_at: string;
  email: string;
  department: string;
  is_active: boolean;
};

function UserList() {
  const [userData, setUserData] = useState({ users: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [limit, setLimit] = useState(PAGINATION_DATA.limit);
  const [page, setPage] = useState(PAGINATION_DATA.page);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await USER_SERVICES.getUsers({ limit, page });
      setUserData(data);
    } catch (error: any) {
      setUserData({ users: [], pagination: {} });
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userIds: string[], loadingCallback: (state: boolean) => void) => {
    loadingCallback(true);
    try {
      const success = await USER_SERVICES.deleteUsers(userIds);

      if (success) {
        toast.success("User deleted successfully");
        fetchUsers();
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

  const updateUserStatus = async (
    userIds: string[],
    status: boolean,
    loadingCallback: (state: boolean) => void
  ) => {
    loadingCallback(true);
    try {
      const success = await USER_SERVICES.updateUserStatus(userIds, status);

      if (success) {
        toast.success("User status updated successfully");
        fetchUsers();
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

  const handleExportUsers = async () => {
    setExportLoading(true);
    try {
      await exportUsersToExcel(userData?.users || []);
      toast.success("Users exported to Excel successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export users");
    } finally {
      setExportLoading(false);
    }
  };

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "mobile_no",
      header: "Mobile",
    },
    {
      accessorKey: "company_name",
      header: "Company",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <StatusToggle
            active={!!row?.original?.is_active}
            onConfirm={(loadingCallback: (state: boolean) => void) => {
              updateUserStatus([row?.original?._id], !row?.original?.is_active, loadingCallback);
            }}
            activeTitle="Deactivate this user?"
            inactiveTitle="Activate this user?"
            activeDescription="User will lose access immediately."
            inactiveDescription="User will be able to login again."
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
            <ConfirmDialog
              title="Delete User"
              description="Are you sure you want to delete this user?"
              confirmText="Delete"
              cancelText="Cancel"
              confirmButtonClassName="bg-destructive hover:bg-destructive/70"
              onConfirm={(loadingCallback: (state: boolean) => void) => {
                deleteUser([row?.original?._id], loadingCallback);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [limit, page]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-off-black text-2xl">Users</h1>
        <button
          onClick={handleExportUsers}
          disabled={exportLoading || !userData?.users?.length}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={18} />
          {exportLoading ? "Exporting..." : "Export to Excel"}
        </button>
      </div>
      <DataTable
        columns={columns}
        data={userData?.users}
        pagination={userData?.pagination}
        onPageChange={(page, limit) => {
          setLimit(limit);
          setPage(page);
        }}
        isLoading={loading}
      />
    </div>
  );
}

export default UserList;
