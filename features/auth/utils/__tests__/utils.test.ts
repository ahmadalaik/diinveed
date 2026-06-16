import { describe, it, expect } from "vitest";
import { sha256, generateToken } from "../utils";

describe("sha256", () => {
  it("produces consistent hash for same input", () => {
    expect(sha256("hello")).toBe(sha256("hello"));
  });

  it("produces 64-character hex string", () => {
    const hash = sha256("test");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it("produces different hash for different inputs", () => {
    expect(sha256("abc")).not.toBe(sha256("xyz"));
  });
});

describe("generateToken", () => {
  it("produces a non-empty string", () => {
    const token = generateToken();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("produces unique tokens on each call", () => {
    const tokens = new Set(Array.from({ length: 10 }, () => generateToken()));
    expect(tokens.size).toBe(10);
  });
});
