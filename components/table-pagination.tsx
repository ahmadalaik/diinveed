import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { buildPageHref, type PageSearchParams } from "@/lib/pagination";

type TablePaginationProps = {
  page: number;
  totalPages: number;
  searchParams: PageSearchParams;
  pageParam?: string;
};

/**
 * Build the list of page slots to render, inserting "ellipsis" markers so the
 * control stays compact for large page counts (e.g. 1 … 4 5 6 … 20).
 */
function getPageSlots(page: number, totalPages: number): (number | "ellipsis")[] {
  const slots = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const pages = [...slots]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function TablePagination({
  page,
  totalPages,
  searchParams,
  pageParam = "page",
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const slots = getPageSlots(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {hasPrev ? (
            <Link
              href={buildPageHref(searchParams, page - 1, pageParam)}
              aria-label="Go to previous page"
              className={cn(buttonVariants({ variant: "ghost", size: "default" }), "pl-2!")}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "pl-2! pointer-events-none opacity-50"
              )}
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </span>
          )}
        </PaginationItem>

        {slots.map((slot, i) =>
          slot === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={slot}>
              <Link
                href={buildPageHref(searchParams, slot, pageParam)}
                aria-current={slot === page ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: slot === page ? "outline" : "ghost",
                    size: "icon",
                  })
                )}
              >
                {slot}
              </Link>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {hasNext ? (
            <Link
              href={buildPageHref(searchParams, page + 1, pageParam)}
              aria-label="Go to next page"
              className={cn(buttonVariants({ variant: "ghost", size: "default" }), "pr-2!")}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Link>
          ) : (
            <span
              aria-disabled
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "pr-2! pointer-events-none opacity-50"
              )}
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
