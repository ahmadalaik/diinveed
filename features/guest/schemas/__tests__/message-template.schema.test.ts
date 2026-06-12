import { describe, it, expect } from "vitest";
import { messageTemplateSchema } from "../message-template.schema";

describe("messageTemplateSchema", () => {
  it("requires a title and a body within limits", () => {
    expect(messageTemplateSchema.safeParse({ title: "", body: "x" }).success).toBe(false);
    expect(messageTemplateSchema.safeParse({ title: "Resmi", body: "Halo {nama} {link}" }).success).toBe(true);
  });
});
