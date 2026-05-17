import { describe, it, expect } from "vitest";
import {
  getManagedRoles,
  canViewUser,
  canManageUser,
  getAllowedRoles,
} from "@/lib/permissions";

describe("getManagedRoles", () => {
  it("returns all three roles for super_admin", () => {
    expect(getManagedRoles("super_admin")).toEqual([
      "user",
      "admin",
      "super_admin",
    ]);
  });

  it("returns only user for admin", () => {
    expect(getManagedRoles("admin")).toEqual(["user"]);
  });

  it("returns empty array for user", () => {
    expect(getManagedRoles("user")).toEqual([]);
  });
});

describe("canViewUser", () => {
  it("allows super_admin to view user-role accounts", () => {
    expect(canViewUser("super_admin", "user")).toBe(true);
  });

  it("allows super_admin to view admin-role accounts", () => {
    expect(canViewUser("super_admin", "admin")).toBe(true);
  });

  it("allows super_admin to view super_admin-role accounts", () => {
    expect(canViewUser("super_admin", "super_admin")).toBe(true);
  });

  it("allows admin to view user-role accounts", () => {
    expect(canViewUser("admin", "user")).toBe(true);
  });

  it("denies admin from viewing admin-role accounts", () => {
    expect(canViewUser("admin", "admin")).toBe(false);
  });

  it("denies admin from viewing super_admin-role accounts", () => {
    expect(canViewUser("admin", "super_admin")).toBe(false);
  });

  it("denies user role from viewing anyone", () => {
    expect(canViewUser("user", "user")).toBe(false);
  });
});

describe("canManageUser", () => {
  it("returns false when actor and target have the same id", () => {
    expect(
      canManageUser(
        { id: "1", role: "super_admin" },
        { id: "1", role: "super_admin" },
      ),
    ).toBe(false);
  });

  it("returns false when admin tries to manage self", () => {
    expect(
      canManageUser({ id: "1", role: "admin" }, { id: "1", role: "admin" }),
    ).toBe(false);
  });

  it("allows super_admin to manage another super_admin", () => {
    expect(
      canManageUser(
        { id: "1", role: "super_admin" },
        { id: "2", role: "super_admin" },
      ),
    ).toBe(true);
  });

  it("allows super_admin to manage admin", () => {
    expect(
      canManageUser(
        { id: "1", role: "super_admin" },
        { id: "2", role: "admin" },
      ),
    ).toBe(true);
  });

  it("allows admin to manage user-role account", () => {
    expect(
      canManageUser({ id: "1", role: "admin" }, { id: "2", role: "user" }),
    ).toBe(true);
  });

  it("denies admin from managing another admin", () => {
    expect(
      canManageUser({ id: "1", role: "admin" }, { id: "2", role: "admin" }),
    ).toBe(false);
  });

  it("denies admin from managing super_admin", () => {
    expect(
      canManageUser(
        { id: "1", role: "admin" },
        { id: "2", role: "super_admin" },
      ),
    ).toBe(false);
  });
});

describe("getAllowedRoles", () => {
  it("returns all three roles for super_admin", () => {
    expect(getAllowedRoles("super_admin")).toEqual([
      "user",
      "admin",
      "super_admin",
    ]);
  });

  it("returns only user for admin", () => {
    expect(getAllowedRoles("admin")).toEqual(["user"]);
  });

  it("returns empty array for user", () => {
    expect(getAllowedRoles("user")).toEqual([]);
  });
});
