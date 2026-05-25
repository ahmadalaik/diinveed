export type FontDef = {
  id: string;
  name: string;
  stack: string;
};

export const FONTS: FontDef[] = [
  {
    id: "serif-display",
    name: "Serif Display",
    stack: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "sans-modern",
    name: "Sans Modern",
    stack: "Inter, system-ui, sans-serif",
  },
  {
    id: "script-elegant",
    name: "Script Elegant",
    stack: "'Dancing Script', cursive",
  },
  {
    id: "mono-clean",
    name: "Mono Clean",
    stack: "'Courier New', Courier, monospace",
  },
];

export const DEFAULT_FONT_ID = "serif-display";
