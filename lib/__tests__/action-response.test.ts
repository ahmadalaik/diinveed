import { describe, it, expect } from "vitest";
import { ok, fail, validationError, ACTION_MESSAGES } from "@/lib/action-response";
import { z } from "zod";

describe("ok", () => {
  it("tanpa payload → success true, data undefined", () => {
    expect(ok("Berhasil")).toEqual({ success: true, message: "Berhasil", data: undefined });
  });
  it("dengan payload → menyertakan data", () => {
    expect(ok("Berhasil", { userId: "u1" })).toEqual({
      success: true,
      message: "Berhasil",
      data: { userId: "u1" },
    });
  });
});

describe("fail", () => {
  it("pesan saja", () => {
    expect(fail("Gagal")).toEqual({ success: false, message: "Gagal", errors: undefined });
  });
  it("pesan + field errors", () => {
    expect(fail("Gagal", { email: ["dipakai"] })).toEqual({
      success: false,
      message: "Gagal",
      errors: { email: ["dipakai"] },
    });
  });
});

describe("validationError", () => {
  it("mengambil field errors dari ZodError dan default message", () => {
    const schema = z.object({ name: z.string().min(1) });
    const parsed = schema.safeParse({ name: "" });
    if (parsed.success) throw new Error("harus gagal");
    const res = validationError(parsed.error);
    expect(res.success).toBe(false);
    expect(res.message).toBe(ACTION_MESSAGES.VALIDATION);
    expect(res.errors?.name?.length).toBeGreaterThan(0);
  });
  it("membuang field tanpa error", () => {
    const schema = z.object({ name: z.string().min(1), age: z.number() });
    const parsed = schema.safeParse({ name: "", age: 5 });
    if (parsed.success) throw new Error("harus gagal");
    const res = validationError(parsed.error);
    expect(res.errors).not.toHaveProperty("age");
  });
});
