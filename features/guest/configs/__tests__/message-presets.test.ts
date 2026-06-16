import { describe, it, expect } from "vitest";
import { MESSAGE_PRESETS } from "../message-presets";

describe("MESSAGE_PRESETS", () => {
  it("has the three expected presets", () => {
    expect(MESSAGE_PRESETS.map((p) => p.id)).toEqual(["islam", "umum", "formal"]);
  });

  it("every preset uses both placeholders", () => {
    for (const preset of MESSAGE_PRESETS) {
      expect(preset.body).toContain("{nama}");
      expect(preset.body).toContain("{link}");
    }
  });

  it("has unique ids and non-empty labels", () => {
    const ids = MESSAGE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of MESSAGE_PRESETS) expect(preset.label.length).toBeGreaterThan(0);
  });
});
