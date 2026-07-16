"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIT_ACTION_OPTIONS } from "../configs/audit-actions";

const ALL = "__all__";

export function AuditLogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== ALL) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-56">
        <Select
          value={params.get("action") ?? ALL}
          onValueChange={(v) => setParam("action", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua aksi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua aksi</SelectItem>
            {AUDIT_ACTION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="date"
        className="w-40"
        defaultValue={params.get("from") ?? ""}
        onChange={(e) => setParam("from", e.target.value || null)}
        aria-label="Dari tanggal"
      />
      <Input
        type="date"
        className="w-40"
        defaultValue={params.get("to") ?? ""}
        onChange={(e) => setParam("to", e.target.value || null)}
        aria-label="Sampai tanggal"
      />
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q") as string;
          setParam("q", q || null);
        }}
      >
        <Input
          name="q"
          placeholder="Cari target/aktor…"
          defaultValue={params.get("q") ?? ""}
          className="w-52"
        />
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>
    </div>
  );
}
