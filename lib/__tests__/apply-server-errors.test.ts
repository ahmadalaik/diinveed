import { describe, it, expect, vi } from "vitest";
import { applyServerErrors } from "@/lib/apply-server-errors";

describe("applyServerErrors", () => {
  it("memanggil setError untuk tiap field (pesan pertama)", () => {
    const setError = vi.fn();
    applyServerErrors(setError, { name: ["wajib"], email: ["dipakai", "lagi"] });
    expect(setError).toHaveBeenCalledWith("name", { type: "server", message: "wajib" });
    expect(setError).toHaveBeenCalledWith("email", { type: "server", message: "dipakai" });
  });
  it("tidak melakukan apa-apa bila errors undefined", () => {
    const setError = vi.fn();
    applyServerErrors(setError, undefined);
    expect(setError).not.toHaveBeenCalled();
  });
  it("melewati field dengan array kosong", () => {
    const setError = vi.fn();
    applyServerErrors(setError, { name: [] });
    expect(setError).not.toHaveBeenCalled();
  });
});
