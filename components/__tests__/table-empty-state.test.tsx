// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Users } from "lucide-react";
import { TableEmptyState } from "../table-empty-state";

afterEach(cleanup);

describe("TableEmptyState", () => {
  it("renders title and description", () => {
    render(
      <TableEmptyState
        icon={Users}
        title="Belum ada tamu"
        description="Tambahkan tamu pertama Anda."
      />
    );
    expect(screen.getByRole("heading", { name: "Belum ada tamu" })).toBeTruthy();
    expect(screen.getByText("Tambahkan tamu pertama Anda.")).toBeTruthy();
  });

  it("renders an action when provided", () => {
    render(
      <TableEmptyState
        icon={Users}
        title="Kosong"
        description="x"
        action={<button>Tambah</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Tambah" })).toBeTruthy();
  });
});
