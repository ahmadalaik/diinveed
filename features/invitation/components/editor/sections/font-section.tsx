"usec client";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { getToken, TokenOverrides } from "@/features/template/tokens";

const HEADING_FONTS = [
  {
    id: "Georgia",
    label: "Serif Display",
    stack: "Georgia, 'Times New Roman', serif",
  },
  { id: "Inter", label: "Sans Modern", stack: "Inter, system-ui, sans-serif" },
  {
    id: "Dancing Script",
    label: "Script Elegant",
    stack: "'Dancing Script', cursive",
  },
  {
    id: "Courier New",
    label: "Mono Clean",
    stack: "'Courier New', Courier, monospace",
  },
];

export function FontSection() {
  const tokenId = useInvitationStore((s) => s.tokenId);
  const tokenOverrides = useInvitationStore((s) => s.tokenOverrides);
  const set = useInvitationStore((s) => s.set);
  const base = getToken(tokenId);

  const currentHeading =
    tokenOverrides?.typography?.heading ??
    base?.typography.heading ??
    "Georgia";

  const setHeadingFont = (font: string) => {
    set({
      tokenOverrides: {
        ...tokenOverrides,
        typography: { ...tokenOverrides?.typography, heading: font },
      },
    });
  }

  const resetFont = () => {
    const { typography: _removed, ...rest } = tokenOverrides ?? {};
    const cleaned =
      Object.keys(rest).length > 0 ? (rest as TokenOverrides) : null;
    set({ tokenOverrides: cleaned });
  }

  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        value={currentHeading}
        onValueChange={(v) => {
          if (v) setHeadingFont(v);
        }}
        className="flex flex-col gap-1"
      >
        {HEADING_FONTS.map((font) => (
          <ToggleGroupItem
            key={font.id}
            value={font.id}
            className="w-full flex items-center justify-between px-3 py-2 h-auto rounded-lg border-2 data-[state=on]:border-primary"
          >
            <span style={{ fontFamily: font.stack }} className="text-base">
              {font.label}
            </span>
            <span
              className="text-xs text-muted-foreground"
              style={{ fontFamily: font.stack }}
            >
              Aa
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {tokenOverrides?.typography && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={resetFont}
        >
          Reset to template default
        </Button>
      )}
    </div>
  );
}
