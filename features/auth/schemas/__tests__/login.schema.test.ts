import { describe, it, expect } from "vitest";
import { loginSchema } from "../login.schema";

describe("loginSchema", () => {
  describe("valid inputs", () => {
    it("accepts valid email and password", () => {
      const result = loginSchema.safeParse({
        identifier: "user@example.com",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid username and password", () => {
      const result = loginSchema.safeParse({
        identifier: "john_doe",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts username with numbers", () => {
      const result = loginSchema.safeParse({
        identifier: "user123",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("identifier validation", () => {
    it("rejects input that is neither valid email nor valid username", () => {
      // has @ (fails username regex) but not a valid email either
      const result = loginSchema.safeParse({
        identifier: "not-an@email-or-username!",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("accepts plain word as username (not invalid email)", () => {
      // 'notanemail' is a valid username (alphanumeric, length >= 3)
      const result = loginSchema.safeParse({
        identifier: "notanemail",
        password: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects username shorter than 3 characters", () => {
      const result = loginSchema.safeParse({
        identifier: "ab",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects username with special characters", () => {
      const result = loginSchema.safeParse({
        identifier: "user@name!",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("password validation", () => {
    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        identifier: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects password shorter than 8 characters", () => {
      const result = loginSchema.safeParse({
        identifier: "user@example.com",
        password: "short",
      });
      expect(result.success).toBe(false);
    });

    it("accepts password exactly 8 characters", () => {
      const result = loginSchema.safeParse({
        identifier: "user@example.com",
        password: "exactly8",
      });
      expect(result.success).toBe(true);
    });
  });
});
