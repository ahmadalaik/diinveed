// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { DataTableCard } from "../data-table-card";

afterEach(cleanup);

describe("DataTableCard", () => {
  it("renders children", () => {
    render(
      <DataTableCard>
        <div>table-body</div>
      </DataTableCard>
    );
    expect(screen.getByText("table-body")).toBeTruthy();
  });

  it("renders the count footer and per-page select when total/perPage are provided", () => {
    render(
      <DataTableCard
        shownCount={10}
        total={42}
        noun="template"
        perPage={20}
        page={1}
        totalPages={5}
        searchParams={{}}
      >
        <div>rows</div>
      </DataTableCard>
    );
    expect(screen.getByText(/Menampilkan/)).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    expect(screen.getByRole("combobox").textContent).toContain("20");
  });

  it("omits the footer when total is undefined", () => {
    render(
      <DataTableCard>
        <div>rows</div>
      </DataTableCard>
    );
    expect(screen.queryByText(/Menampilkan/)).toBeNull();
  });
});
