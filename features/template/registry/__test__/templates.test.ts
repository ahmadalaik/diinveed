import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  DEFAULT_TEMPLATE_SLUG,
  getTemplate,
} from "../templates";
import KelanaTemplate from "../../components/templates/kelana";

describe("templates registry", () => {
  it("includes the kelana template", () => {
    expect(TEMPLATES.kelana).toBe(KelanaTemplate);
  });

  it("default slug is registered", () => {
    expect(TEMPLATES[DEFAULT_TEMPLATE_SLUG]).toBeDefined();
  });
});

describe("getTemplate", () => {
  it("returns the component for a known slug", () => {
    expect(getTemplate("kelana")).toBe(KelanaTemplate);
  });

  it("falls back to the default for an unknown slug", () => {
    expect(getTemplate("does-not-exist")).toBe(TEMPLATES[DEFAULT_TEMPLATE_SLUG]);
  });

  it("falls back to the default for an empty slug", () => {
    expect(getTemplate("")).toBe(TEMPLATES[DEFAULT_TEMPLATE_SLUG]);
  });
});
