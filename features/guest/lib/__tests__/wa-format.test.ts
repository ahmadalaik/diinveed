import { describe, it, expect } from "vitest";
import { tokenizeWhatsappFormatting, wrapSelection } from "../wa-format";

describe("tokenizeWhatsappFormatting", () => {
  it("parses bold, italic, and strikethrough", () => {
    expect(tokenizeWhatsappFormatting("a *b* _c_ ~d~")).toEqual([
      { type: "text", value: "a " },
      { type: "bold", value: "b" },
      { type: "text", value: " " },
      { type: "italic", value: "c" },
      { type: "text", value: " " },
      { type: "strike", value: "d" },
    ]);
  });

  it("turns newlines into newline tokens", () => {
    expect(tokenizeWhatsappFormatting("a\nb")).toEqual([
      { type: "text", value: "a" },
      { type: "newline" },
      { type: "text", value: "b" },
    ]);
  });

  it("renders an unclosed marker as literal text", () => {
    expect(tokenizeWhatsappFormatting("a *b")).toEqual([{ type: "text", value: "a *b" }]);
  });
});

describe("wrapSelection", () => {
  it("wraps the selected range and shifts the selection", () => {
    expect(wrapSelection("hello world", 6, 11, "*")).toEqual({
      value: "hello *world*",
      selectionStart: 7,
      selectionEnd: 12,
    });
  });

  it("inserts empty markers at a collapsed caret", () => {
    expect(wrapSelection("ab", 1, 1, "_")).toEqual({
      value: "a__b",
      selectionStart: 2,
      selectionEnd: 2,
    });
  });
});
