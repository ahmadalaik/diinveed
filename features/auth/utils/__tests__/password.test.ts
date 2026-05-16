import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("hashPassword", () => {
  it("produces a hash different from plain text", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).not.toBe("secret123");
  });

  it("produces a bcrypt hash (starts with $2b$)", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).toMatch(/^\$2b\$/);
  });

  it("produces different hashes for same input (salted)", async () => {
    const [hash1, hash2] = await Promise.all([
      hashPassword("secret123"),
      hashPassword("secret123"),
    ]);
    expect(hash1).not.toBe(hash2);
  });
});

describe("verifyPassword", () => {
  it("returns true for correct password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("mypassword", hash)).toBe(true);
  });

  it("returns false for wrong password", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("wrongpassword", hash)).toBe(false);
  });

  it("returns false for empty string against real hash", async () => {
    const hash = await hashPassword("mypassword");
    expect(await verifyPassword("", hash)).toBe(false);
  });
});
