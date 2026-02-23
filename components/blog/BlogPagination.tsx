"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function BlogPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const getHref = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    return `?${params.toString()}`;
  };
  // const getHref = (p: number) => `?page=${p}`;

  if (totalPages <= 1) return null;

  // Compute visible pages: current, current-1, current+1
  const visible = [currentPage - 1, currentPage, currentPage + 1].filter(
    (p) => p > 1 && p < totalPages
  ); // keep only between 2..last-1

  return (
    <Pagination className="mt-10">
      <PaginationContent className="gap-2">
        {/* Prev */}
        {currentPage > 1 && (
          <PaginationItem>
            <Link
              href={getHref(currentPage - 1)}
              className="rounded-lg text-sm hover:text-primary text-medium-dark flex justify-center items-center h-9 px-2"
            >
              <ChevronLeft />
            </Link>
          </PaginationItem>
        )}
        {/* 1 */}
        <PaginationItem>
          <Link
            href={getHref(1)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm",
              currentPage === 1
                ? "bg-secondary text-white border-secondary"
                : "hover:bg-secondary/10"
            )}
          >
            1
          </Link>
        </PaginationItem>
        {/* Left Ellipsis */}
        {visible[0] > 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* Middle pages (only 3 max) */}
        {visible.map((p) => (
          <PaginationItem key={p}>
            <Link
              href={getHref(p)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm transition",
                p === currentPage
                  ? "bg-secondary text-white border-secondary"
                  : "hover:bg-secondary/10 text-off-black"
              )}
            >
              {p}
            </Link>
          </PaginationItem>
        ))}

        {/* Right Ellipsis */}
        {visible[visible.length - 1] < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last Page */}
        {totalPages > 1 && (
          <PaginationItem>
            <Link
              href={getHref(totalPages)}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm",
                currentPage === totalPages
                  ? "bg-secondary text-white border-secondary"
                  : "hover:bg-secondary/10"
              )}
            >
              {totalPages}
            </Link>
          </PaginationItem>
        )}

        {/* Next */}
        {currentPage < totalPages && (
          <PaginationItem>
            <Link
              href={getHref(currentPage + 1)}
              className="rounded-lg text-sm hover:text-primary text-medium-dark flex justify-center items-center h-9 px-2"
            >
              <ChevronRight />
            </Link>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
