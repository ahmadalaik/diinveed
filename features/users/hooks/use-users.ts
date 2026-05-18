"use client";

import { useState, useTransition } from "react";

export type UsersFilterState = {
  search: string;
  role: string;
  status: string;
};

const defaultFilters: UsersFilterState = {
  search: "",
  role: "all",
  status: "all",
};

export function useUsers() {
  const [filters, setFilters] = useState<UsersFilterState>(defaultFilters);
  const [isPending, startTransition] = useTransition();

  function updateFilter<K extends keyof UsersFilterState>(
    key: K,
    value: UsersFilterState[K],
  ) {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    });
  }

  function resetFilters() {
    startTransition(() => {
      setFilters(defaultFilters);
    });
  }

  return { filters, isPending, updateFilter, resetFilters };
}
