import { describe, expect, it } from "vitest";
import {
  TemplateModeContext,
  TemplateModeProvider,
  useTemplateMode,
} from "../template-mode-context";

describe("template-mode-context", () => {
  it("exports TemplateModeProvider", () => {
    expect(TemplateModeProvider).toBeDefined();
  });

  it("exports useTemplateMode as a function", () => {
    expect(typeof useTemplateMode).toBe("function");
  });

  it("context default value is 'guest'", () => {
    type ContextInternal<T> = { _currentValue: T };
    expect(
      (TemplateModeContext as unknown as ContextInternal<"preview" | "guest">)
        ._currentValue,
    ).toBe("guest");
  });
});
