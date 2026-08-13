"use client";

import { useEffect } from "react";
import { loadGoogleFont } from "@/lib/load-google-font";

export function useGoogleFonts(values: readonly string[]) {
  const fontKey = values.join("\u0000");

  useEffect(() => {
    for (const value of fontKey.split("\u0000")) {
      loadGoogleFont(value);
    }
  }, [fontKey]);
}
