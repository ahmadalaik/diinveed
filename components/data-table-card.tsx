import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/table-pagination";
import { PerPageSelect } from "@/components/per-page-select";
import type { PageSearchParams } from "@/lib/pagination";

type DataTableCardProps = {
  children: ReactNode;
  /** Footer is rendered only when `total` is provided. */
  total?: number;
  shownCount?: number;
  noun?: string;
  /** When provided, renders the rows-per-page selector in the footer. */
  perPage?: number;
  page?: number;
  totalPages?: number;
  searchParams?: PageSearchParams;
  pageParam?: string;
};

export function DataTableCard({
  children,
  total,
  shownCount,
  noun = "data",
  perPage,
  page = 1,
  totalPages = 1,
  searchParams = {},
  pageParam,
}: DataTableCardProps) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="overflow-x-auto">{children}</div>
      {total !== undefined && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
          <span className="text-muted-foreground text-xs">
            Menampilkan{" "}
            <span className="text-foreground font-mono">{shownCount}</span> dari{" "}
            <span className="font-mono">{total}</span> {noun}
          </span>
          <div className="flex items-center gap-4">
            {perPage !== undefined && (
              <PerPageSelect perPage={perPage} searchParams={searchParams} />
            )}
            <TablePagination
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
              pageParam={pageParam}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
