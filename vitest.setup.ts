import { vi } from "vitest";

vi.mock("next/font/google", () => {
  const mockFont = () => ({
    variable: "mock-font-variable",
    className: "mock-font-class",
    style: { fontFamily: "mock-font" },
  });
  return {
    Cabin: mockFont,
    Great_Vibes: mockFont,
    Playfair_Display: mockFont,
    Inter: mockFont,
    Outfit: mockFont,
    Plus_Jakarta_Sans: mockFont,
  };
});

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}
