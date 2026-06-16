import { describe, expect, it } from "vitest";
import { getPagination, PER_PAGE_OPTIONS, DEFAULT_PER_PAGE } from "../pagination";

describe("getPagination perPage", () => {
  it("defaults to DEFAULT_PER_PAGE when perPage is absent", () => {
    const r = getPagination({});
    expect(r.perPage).toBe(DEFAULT_PER_PAGE);
    expect(r.take).toBe(DEFAULT_PER_PAGE);
  });

  it("honors a whitelisted perPage value", () => {
    const r = getPagination({ perPage: "50" });
    expect(r.perPage).toBe(50);
    expect(r.take).toBe(50);
  });

  it("falls back to default for a non-whitelisted value", () => {
    expect(getPagination({ perPage: "999" }).perPage).toBe(DEFAULT_PER_PAGE);
    expect(getPagination({ perPage: "abc" }).perPage).toBe(DEFAULT_PER_PAGE);
  });

  it("computes skip from page and perPage together", () => {
    const r = getPagination({ page: "3", perPage: "10" });
    expect(r.skip).toBe(20);
    expect(r.take).toBe(10);
  });

  it("exposes the option whitelist including the default", () => {
    expect(PER_PAGE_OPTIONS).toContain(DEFAULT_PER_PAGE);
  });
});
