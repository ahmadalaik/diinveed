// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PageHeader } from "../page-header";

afterEach(cleanup);

describe("PageHeader", () => {
  it("renders the title as a level-1 heading", () => {
    render(<PageHeader title="Templates" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Templates");
  });

  it("renders the subtitle when provided", () => {
    render(<PageHeader title="Tamu" subtitle="12 tamu · 4 hadir" />);
    expect(screen.getByText("12 tamu · 4 hadir")).toBeTruthy();
  });

  it("renders action slot content", () => {
    render(<PageHeader title="Users" actions={<button>Tambah</button>} />);
    expect(screen.getByRole("button", { name: "Tambah" })).toBeTruthy();
  });
});
