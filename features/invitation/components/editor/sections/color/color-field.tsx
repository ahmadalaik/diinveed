"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useTokenUpdate } from "@/features/invitation/hooks/editor-sections/use-token-update";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HexAlphaColorPicker } from "react-colorful";

function ColorPickerPanel({
  value,
  onColorChange,
}: {
  value: string;
  onColorChange: (val: string) => void;
}) {
  return (
    <div className="space-y-4">
      <HexAlphaColorPicker
        color={value}
        onChange={onColorChange}
        style={{ width: "100%", height: "160px" }}
      />

      <div className="flex items-center gap-2">
        <span
          className="size-7 shrink-0 rounded-full border shadow-sm block"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onColorChange(event.target.value)}
          className="w-full h-8 rounded-md border bg-background px-3 text-xs uppercase text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-pink-500"
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {[
          "#000000",
          "#343a40",
          "#868e96",
          "#ced4da",
          "#f8f9fa",
          "#ffffff",
          "#339af0",
          "#20c997",
          "#94d82d",
          "#fcc419",
          "#ff922b",
          "#ff8787",
          "#4dabf7",
          "#38d9a9",
          "#b2f2bb",
          "#ffec99",
          "#ffd8a8",
          "#f06595",
        ].map((color) => (
          <button
            key={color}
            type="button"
            className="size-5 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-transform focus-visible:ring-1 focus-visible:ring-pink-500 focus-visible:outline-none"
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
}

function ColorFieldRow({
  label,
  value,
  isOn,
  onColorChange,
  onClear,
  onToggle,
}: {
  label: string;
  value: string;
  isOn: boolean;
  onColorChange: (newColor: string) => void;
  onClear: () => void;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-4 py-2.5 shadow-xs transition-colors hover:border-pink-500/30">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span
              className="size-5 rounded-full shadow-inner border border-black/10 block"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-64 p-4 rounded-xl shadow-lg border-muted"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm text-pink-500">{label}</h4>
          </div>

          <div className="space-y-4">
            <ColorPickerPanel value={value} onColorChange={onColorChange} />

            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-500 h-auto p-0 hover:bg-transparent hover:text-blue-600"
                onClick={onClear}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-pink-500/10 px-2 py-0.5 rounded-full">
          <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
            {isOn ? "On" : "Off"}
          </span>
        </div>
        <Switch
          checked={isOn}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-pink-500"
        />
      </div>
    </div>
  );
}

function ColorButtonRow({
  label,
  textValue,
  bgValue,
  isOn,
  onTextChange,
  onBgChange,
  onClear,
  onToggle,
}: {
  label: string;
  textValue: string;
  bgValue: string;
  isOn: boolean;
  onTextChange: (newColor: string) => void;
  onBgChange: (newColor: string) => void;
  onClear: () => void;
  onToggle: (checked: boolean) => void;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-background px-4 py-2.5 shadow-xs transition-colors hover:border-pink-500/30">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span
              className="size-5 rounded-md shadow-inner border border-black/10 block"
              style={{ backgroundColor: bgValue }}
            />
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-64 p-4 rounded-xl shadow-lg border-muted"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm text-pink-500">{label}</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-foreground">
                Preview
              </div>
              <div className="rounded-xl border py-8 flex justify-center shadow-xs bg-muted/20">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  style={{ backgroundColor: bgValue, color: textValue }}
                >
                  Button
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-foreground">
                Atur Warna
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border p-3 flex items-center gap-3 shadow-xs bg-background hover:bg-muted/40 transition-colors"
                  >
                    <span
                      className="size-5 rounded-md border shadow-sm block"
                      style={{ backgroundColor: textValue }}
                    />
                    <span className="text-sm font-medium">Text</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "center" : "start"}
                  sideOffset={isMobile ? 8 : 16}
                  collisionPadding={10}
                  className="w-64 p-4 rounded-xl shadow-lg border-muted z-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-sm text-pink-500">Text</h4>
                  </div>
                  <ColorPickerPanel
                    value={textValue}
                    onColorChange={onTextChange}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border p-3 flex items-center gap-3 shadow-xs bg-background hover:bg-muted/40 transition-colors"
                  >
                    <span
                      className="size-5 rounded-md border shadow-sm block"
                      style={{ backgroundColor: bgValue }}
                    />
                    <span className="text-sm font-medium">Background</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "center" : "start"}
                  sideOffset={isMobile ? 8 : 16}
                  collisionPadding={10}
                  className="w-64 p-4 rounded-xl shadow-lg border-muted z-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-sm text-pink-500">
                      Background
                    </h4>
                  </div>
                  <ColorPickerPanel value={bgValue} onColorChange={onBgChange} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-500 h-auto p-0 hover:bg-transparent hover:text-blue-600"
                onClick={onClear}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-pink-500/10 px-2 py-0.5 rounded-full">
          <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
            {isOn ? "On" : "Off"}
          </span>
        </div>
        <Switch
          checked={isOn}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-pink-500"
        />
      </div>
    </div>
  );
}

export function ColorBackgroundField() {
  const { resolvedTokens, overrides, updateColor } = useTokenUpdate();
  const background = resolvedTokens.colors.background;
  const backgroundOverrides = overrides?.colors?.background;

  return (
    <AccordionItem value="background" className="border-none">
      <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        Background
      </AccordionTrigger>
      <AccordionContent className="pt-1 pb-4 h-auto!">
        <div className="flex flex-col gap-2.5">
          <ColorFieldRow
            label="Primary"
            value={background.primary || "#000000"}
            isOn={backgroundOverrides?.primary !== undefined}
            onColorChange={(val) => updateColor("background", "primary", val)}
            onClear={() => updateColor("background", "primary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "background",
                "primary",
                checked ? background.primary || "#000000" : undefined,
              )
            }
          />

          <ColorFieldRow
            label="Secondary"
            value={background.secondary || "#000000"}
            isOn={backgroundOverrides?.secondary !== undefined}
            onColorChange={(val) =>
              updateColor("background", "secondary", val)
            }
            onClear={() => updateColor("background", "secondary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "background",
                "secondary",
                checked ? background.secondary || "#000000" : undefined,
              )
            }
          />

          <ColorFieldRow
            label="Tertiary"
            value={background.tertiary || "#000000"}
            isOn={backgroundOverrides?.tertiary !== undefined}
            onColorChange={(val) => updateColor("background", "tertiary", val)}
            onClear={() => updateColor("background", "tertiary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "background",
                "tertiary",
                checked ? background.tertiary || "#000000" : undefined,
              )
            }
          />

          {background.inverse && (
            <ColorFieldRow
              label="Inverse"
              value={background.inverse || "#000000"}
              isOn={backgroundOverrides?.inverse !== undefined}
              onColorChange={(val) =>
                updateColor("background", "inverse", val)
              }
              onClear={() => updateColor("background", "inverse", undefined)}
              onToggle={(checked) =>
                updateColor(
                  "background",
                  "inverse",
                  checked ? background.inverse || "#000000" : undefined,
                )
              }
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ColorTextField() {
  const { resolvedTokens, overrides, updateColor } = useTokenUpdate();
  const text = resolvedTokens.colors.text;
  const textOverrides = overrides?.colors?.text;

  return (
    <AccordionItem value="text" className="border-none">
      <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        Text
      </AccordionTrigger>
      <AccordionContent className="pt-1 pb-4 h-auto!">
        <div className="flex flex-col gap-2.5">
          <ColorFieldRow
            label="Primary"
            value={text.primary || "#000000"}
            isOn={textOverrides?.primary !== undefined}
            onColorChange={(val) => updateColor("text", "primary", val)}
            onClear={() => updateColor("text", "primary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "text",
                "primary",
                checked ? text.primary || "#000000" : undefined,
              )
            }
          />

          <ColorFieldRow
            label="Secondary"
            value={text.secondary || "#000000"}
            isOn={textOverrides?.secondary !== undefined}
            onColorChange={(val) => updateColor("text", "secondary", val)}
            onClear={() => updateColor("text", "secondary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "text",
                "secondary",
                checked ? text.secondary || "#000000" : undefined,
              )
            }
          />

          <ColorFieldRow
            label="Tertiary"
            value={text.tertiary || "#000000"}
            isOn={textOverrides?.tertiary !== undefined}
            onColorChange={(val) => updateColor("text", "tertiary", val)}
            onClear={() => updateColor("text", "tertiary", undefined)}
            onToggle={(checked) =>
              updateColor(
                "text",
                "tertiary",
                checked ? text.tertiary || "#000000" : undefined,
              )
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function ColorButtonField() {
  const { resolvedTokens, overrides, updateButtonColor } = useTokenUpdate();
  const button = resolvedTokens.colors.button;
  const buttonOverrides = overrides?.colors?.button;

  return (
    <AccordionItem value="button" className="border-none">
      <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180">
        Button
      </AccordionTrigger>
      <AccordionContent className="pt-1 pb-4 h-auto!">
        <div className="flex flex-col gap-2.5">
          <ColorButtonRow
            label="Primary"
            textValue={button.primary.text || "#ffffff"}
            bgValue={button.primary.background || "#000000"}
            isOn={
              buttonOverrides?.primary?.background !== undefined ||
              buttonOverrides?.primary?.text !== undefined
            }
            onTextChange={(val) => updateButtonColor("primary", "text", val)}
            onBgChange={(val) =>
              updateButtonColor("primary", "background", val)
            }
            onClear={() => {
              updateButtonColor("primary", "background", undefined);
              updateButtonColor("primary", "text", undefined);
            }}
            onToggle={(checked) => {
              updateButtonColor(
                "primary",
                "background",
                checked ? button.primary.background || "#000000" : undefined,
              );
              updateButtonColor(
                "primary",
                "text",
                checked ? button.primary.text || "#ffffff" : undefined,
              );
            }}
          />

          <ColorButtonRow
            label="Secondary"
            textValue={button.secondary.text || "#ffffff"}
            bgValue={button.secondary.background || "#000000"}
            isOn={
              buttonOverrides?.secondary?.background !== undefined ||
              buttonOverrides?.secondary?.text !== undefined
            }
            onTextChange={(val) => updateButtonColor("secondary", "text", val)}
            onBgChange={(val) =>
              updateButtonColor("secondary", "background", val)
            }
            onClear={() => {
              updateButtonColor("secondary", "background", undefined);
              updateButtonColor("secondary", "text", undefined);
            }}
            onToggle={(checked) => {
              updateButtonColor(
                "secondary",
                "background",
                checked ? button.secondary.background || "#000000" : undefined,
              );
              updateButtonColor(
                "secondary",
                "text",
                checked ? button.secondary.text || "#ffffff" : undefined,
              );
            }}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
