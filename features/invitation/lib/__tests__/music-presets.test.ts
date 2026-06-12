import { describe, expect, it } from "vitest";
import { MUSIC_PRESETS } from "../music-presets";

describe("MUSIC_PRESETS", () => {
  it("exposes a non-empty list of well-formed presets", () => {
    expect(MUSIC_PRESETS.length).toBeGreaterThan(0);
    for (const preset of MUSIC_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.url).toMatch(/^https?:\/\//);
    }
  });

  it("has unique ids and urls", () => {
    const ids = MUSIC_PRESETS.map((p) => p.id);
    const urls = MUSIC_PRESETS.map((p) => p.url);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
