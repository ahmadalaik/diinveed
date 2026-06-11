import { describe, expect, it, vi } from "vitest";

describe("resizeToWebp", () => {
  it("returns a webp blob no larger than maxEdge on its longest side", async () => {
    // Mock createImageBitmap to a 4000x2000 source.
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({ width: 4000, height: 2000, close: () => {} })),
    );

    const drawn: { w: number; h: number } = { w: 0, h: 0 };
    class FakeCanvas {
      width = 0;
      height = 0;
      getContext() {
        return {
          drawImage: (_img: unknown, _x: number, _y: number, w: number, h: number) => {
            drawn.w = w;
            drawn.h = h;
          },
        };
      }
      convertToBlob() {
        return Promise.resolve(new Blob(["x"], { type: "image/webp" }));
      }
    }
    class MockOffscreenCanvas extends FakeCanvas {
      constructor(w: number, h: number) {
        super();
        this.width = w;
        this.height = h;
      }
    }
    vi.stubGlobal("OffscreenCanvas", MockOffscreenCanvas as unknown as typeof OffscreenCanvas);

    const { resizeToWebp } = await import("../resize-image");
    const blob = await resizeToWebp(new File([], "p.jpg"), 2000);

    expect(blob.type).toBe("image/webp");
    expect(Math.max(drawn.w, drawn.h)).toBe(2000);
    expect(drawn.w).toBe(2000);
    expect(drawn.h).toBe(1000);
  });
});
