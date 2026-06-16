"use client";

import { createContext, useContext } from "react";

type TemplateMode = "preview" | "guest";

export const TemplateModeContext = createContext<TemplateMode>("guest");
export const TemplateModeProvider = TemplateModeContext.Provider;

export function useTemplateMode(): TemplateMode {
  return useContext(TemplateModeContext);
}
