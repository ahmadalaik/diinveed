"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_PER_PAGE,
  PER_PAGE_OPTIONS,
  type PageSearchParams,
} from "@/lib/pagination";

type PerPageSelectProps = {
  perPage: number;
  searchParams: PageSearchParams;
};

export function PerPageSelect({ perPage, searchParams }: PerPageSelectProps) {
  const router = useRouter();

  const onChange = (value: string) => {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(searchParams)) {
      // Drop `page` (reset to first page) and the old `perPage`.
      if (key === "page" || key === "perPage" || val === undefined) continue;
      if (Array.isArray(val)) val.forEach((v) => params.append(key, v));
      else params.set(key, val);
    }
    if (Number(value) !== DEFAULT_PER_PAGE) params.set("perPage", value);
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground hidden text-xs sm:inline">Baris</span>
      <Select value={String(perPage)} onValueChange={onChange}>
        <SelectTrigger size="sm" className="w-17">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PER_PAGE_OPTIONS.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
