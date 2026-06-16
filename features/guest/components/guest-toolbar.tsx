"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_FILTERS = [
  { key: "all", label: "Semua" },
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
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={status} onValueChange={(v) => setParam("status", v === "all" ? null : v)}>
        <TabsList>
          {STATUS_FILTERS.map((f) => (
            <TabsTrigger key={f.key} value={f.key}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Select
          value={category}
          onValueChange={(v) => setParam("category", v === ALL_CATEGORIES ? null : v)}
        >
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Semua kategori</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau telepon…"
            className="h-8 w-56 pl-8"
          />
        </div>
      </div>
    </div>
  );
}
