import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  DEFAULT_TEMPLATE_SLUG,
  GetTemplate,
} from "../templates";
import KelanaTemplate from "../../components/templates/kelana";
import RenjanaTemplate from "../../components/templates/renjana";

describe("templates registry", () => {
  it("includes the kelana template", () => {
    expect(TEMPLATES.kelana).toBe(KelanaTemplate);
  });

  it("includes the renjana template", () => {
    expect(TEMPLATES.renjana).toBe(RenjanaTemplate);
  });

  it("default slug is registered", () => {
    expect(TEMPLATES[DEFAULT_TEMPLATE_SLUG]).toBeDefined();
  });
});

describe("getTemplate", () => {
  it("returns the component for a known slug", () => {
    expect(GetTemplate("kelana")).toBe(KelanaTemplate);
  });

  it("returns the renjana component for the renjana slug", () => {
    expect(GetTemplate("renjana")).toBe(RenjanaTemplate);
  });

  it("falls back to the default for an unknown slug", () => {
    expect(GetTemplate("does-not-exist")).toBe(TEMPLATES[DEFAULT_TEMPLATE_SLUG]);
  });

  it("falls back to the default for an empty slug", () => {
    expect(GetTemplate("")).toBe(TEMPLATES[DEFAULT_TEMPLATE_SLUG]);
  });
});
