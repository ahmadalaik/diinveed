"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_FILTERS = [
  { key: "all", label: "Semua Status" },
  { key: "hadir", label: "Hadir" },
  { key: "menunggu", label: "Menunggu" },
  { key: "mungkin", label: "Mungkin" },
  { key: "tidak-hadir", label: "Tidak hadir" },
];

const ALL_CATEGORIES = "__all__";

export function GuestToolbar({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");

  // Update URL helper: change one param, drop `page`, keep the rest.
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    next.delete("upage");
    router.replace(`${pathname}?${next.toString()}`);
  };

  // Debounce search.
  useEffect(() => {
    const current = params.get("q") ?? "";
    if (query === current) return;
    const id = setTimeout(() => setParam("q", query.trim() || null), 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const status = params.get("status") ?? "all";
  const category = params.get("category") ?? ALL_CATEGORIES;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative w-full flex-1">
        <Search className="text-zinc-400 absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau telepon..."
          className="h-9 pl-9 pr-4 bg-zinc-50 border-zinc-200 focus:bg-white rounded-full text-[13.5px] font-medium"
        />
      </div>

      <div className="flex items-center gap-2 sm:w-[320px] shrink-0">
        <Select
          value={status}
          onValueChange={(v) => setParam("status", v === "all" ? null : v)}
        >
          <SelectTrigger size="sm" className="w-full bg-white border-zinc-200 rounded-full h-9 text-[13.5px] font-semibold text-zinc-500">
            <SelectValue placeholder="Status Kehadiran" />
          </SelectTrigger>
          <SelectContent position="popper">
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.key} value={f.key}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={(v) =>
            setParam("category", v === ALL_CATEGORIES ? null : v)
          }
        >
          <SelectTrigger size="sm" className="w-full bg-white border-zinc-200 rounded-full h-9 text-[13.5px] font-semibold text-zinc-500">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Semua Kategori</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
