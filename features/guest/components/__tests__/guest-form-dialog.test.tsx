// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/guest/actions/create-guest", () => ({
  createGuest: vi.fn(async () => ({ success: true, message: "Tamu ditambahkan" })),
}));
vi.mock("@/features/guest/actions/update-guest", () => ({
  updateGuest: vi.fn(async () => ({ success: true, message: "Tamu diperbarui" })),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { GuestFormDialog } from "../guest-form-dialog";
import { createGuest } from "@/features/guest/actions/create-guest";

const createGuestMock = createGuest as ReturnType<typeof vi.fn>;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("GuestFormDialog (create)", () => {
  it("submits name and invitedCount to createGuest", async () => {
    render(<GuestFormDialog mode="create" categories={[]} trigger={<button>Tambah</button>} />);

    fireEvent.click(screen.getByText("Tambah"));
    fireEvent.change(screen.getByLabelText("Nama"), { target: { value: "Budi" } });
    fireEvent.click(screen.getByRole("button", { name: /simpan/i }));

    await waitFor(() => expect(createGuestMock).toHaveBeenCalled());
    expect(createGuestMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Budi", invitedCount: 1 }),
    );
  });
});
