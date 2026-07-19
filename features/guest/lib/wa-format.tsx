import type { ReactNode } from "react";

export type WaToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "strike"; value: string }
  | { type: "newline" };

const PATTERN = /(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~|\n)/g;

/** Tokenize WhatsApp markup. Unclosed markers fall through as literal text. */
export function tokenizeWhatsappFormatting(text: string): WaToken[] {
  const tokens: WaToken[] = [];
  let last = 0;
  for (const match of text.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: "text", value: text.slice(last, index) });
    const raw = match[0];
    if (raw === "\n") tokens.push({ type: "newline" });
    else if (raw.startsWith("*")) tokens.push({ type: "bold", value: raw.slice(1, -1) });
    else if (raw.startsWith("_")) tokens.push({ type: "italic", value: raw.slice(1, -1) });
    else tokens.push({ type: "strike", value: raw.slice(1, -1) });
    last = index + raw.length;
  }
  if (last < text.length) tokens.push({ type: "text", value: text.slice(last) });
  return tokens;
}

/** Render WhatsApp markup as React nodes for the preview bubble. */
export function renderWhatsappFormatting(text: string): ReactNode {
  return tokenizeWhatsappFormatting(text).map((token, i) => {
    switch (token.type) {
      case "newline":
        return <br key={i} />;
      case "bold":
        return <strong key={i}>{token.value}</strong>;
      case "italic":
        return <em key={i}>{token.value}</em>;
      case "strike":
        return <s key={i}>{token.value}</s>;
      default:
        return <span key={i}>{token.value}</span>;
    }
  });
}

/** Wrap a textarea selection in a marker, returning the new value and selection. */
export function wrapSelection(
  value: string,
  start: number,
  end: number,
  marker: string,
): { value: string; selectionStart: number; selectionEnd: number } {
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  if (before.endsWith(marker) && after.startsWith(marker)) {
    return {
      value: `${before.slice(0, -marker.length)}${selected}${after.slice(marker.length)}`,
      selectionStart: start - marker.length,
      selectionEnd: end - marker.length,
    };
  }

  if (
    selected.length >= marker.length * 2 &&
    selected.startsWith(marker) &&
    selected.endsWith(marker)
  ) {
    return {
      value: `${before}${selected.slice(marker.length, -marker.length)}${after}`,
      selectionStart: start,
      selectionEnd: end - marker.length * 2,
    };
  }

  return {
    value: `${before}${marker}${selected}${marker}${after}`,
    selectionStart: start + marker.length,
    selectionEnd: end + marker.length,
  };
}
