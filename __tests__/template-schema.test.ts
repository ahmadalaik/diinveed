import { describe, it, expect } from "vitest";
import { createTemplateActionSchema } from "@/features/template/schemas/create-template";

describe("createTemplateActionSchema", () => {
  const base = {
    name: "Coastal",
    category: "Elegant",
    status: "draft" as const,
    thumbnailUrl: "https://pub-test.r2.dev/sample.jpg",
  };

  it("accepts valid data with thumbnailUrl", () => {
    const result = createTemplateActionSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects missing thumbnailUrl", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { thumbnailUrl, ...rest } = base;
    const result = createTemplateActionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects non-URL thumbnailUrl", () => {
    const result = createTemplateActionSchema.safeParse({
      ...base,
      thumbnailUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = createTemplateActionSchema.safeParse({ ...base, name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional description", () => {
    const result = createTemplateActionSchema.safeParse({
      ...base,
      description: "A beautiful template",
    });
    expect(result.success).toBe(true);
  });
});
