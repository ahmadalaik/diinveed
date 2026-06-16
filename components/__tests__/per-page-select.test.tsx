// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { PerPageSelect } from "../per-page-select";

afterEach(cleanup);

describe("PerPageSelect", () => {
  it("shows the current page size in the trigger", () => {
    render(<PerPageSelect perPage={50} searchParams={{}} />);
    expect(screen.getByRole("combobox").textContent).toContain("50");
  });
});
