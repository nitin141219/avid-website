"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGINATION_DATA } from "@/constants";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { DataTablePagination } from "./pagination";

export interface DataTableBaseProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export interface DataTableWithPaginationProps<TData, TValue>
  extends DataTableBaseProps<TData, TValue> {
  pagination: any;
  onPaginationChange?: () => void;
  onPageChange: (page: number, limit: number) => void;
}

export interface DataTableWithoutPaginationProps<TData, TValue>
  extends DataTableBaseProps<TData, TValue> {
  pagination: false;
  onPaginationChange?: () => void;
  onPageChange?: (page: number, limit: number) => void;
}

export type DataTableProps<TData, TValue> =
  | DataTableWithPaginationProps<TData, TValue>
  | DataTableWithoutPaginationProps<TData, TValue>;

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { columns, data, isLoading = false, pagination, onPageChange } = props;

  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (!onPageChange) return;
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: (pagination?.current_page > 0 ? pagination?.current_page - 1 : 0) || 0,
              pageSize: pagination?.limit || PAGINATION_DATA.limit,
            })
          : updater;

      onPageChange(next.pageIndex + 1, next.pageSize);
    },
    manualPagination: true,
    pageCount: pagination?.total_page || 0,
    state: {
      rowSelection,
      pagination: {
        pageIndex: (pagination?.current_page > 0 ? pagination?.current_page - 1 : 0) || 0,
        pageSize: pagination?.limit || PAGINATION_DATA.limit,
      },
    },
  });

  return (
    <div className="w-full max-w-full">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-section">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="last:text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-50 text-center">
                  <Spinner className="mx-auto size-8" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left last:text-right">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-50 text-light-dark text-base text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>{" "}
      {pagination !== false && <DataTablePagination table={table} />}
    </div>
  );
}
