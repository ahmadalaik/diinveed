"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, "0");

/** Parse a `HH:MM` string into hour/minute parts. */
function parse(value?: string): { h: number; m: number } | null {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h, m };
}

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "--.--",
  id,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsed = parse(value);

  const select = (h: number, m: number) => {
    onChange?.(`${pad(h)}:${pad(m)}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "w-full min-w-0 justify-between font-normal",
            !parsed && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {parsed ? `${pad(parsed.h)}.${pad(parsed.m)}` : placeholder}
          </span>
          <ClockIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex h-60 divide-x">
          <TimeColumn
            values={HOURS}
            selected={parsed?.h}
            onSelect={(h) => select(h, parsed?.m ?? 0)}
          />
          <TimeColumn
            values={MINUTES}
            selected={parsed?.m}
            onSelect={(m) => select(parsed?.h ?? 0, m)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TimeColumn({
  values,
  selected,
  onSelect,
}: {
  values: number[];
  selected?: number;
  onSelect: (value: number) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  // Center the selected value when the popover opens.
  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const el = selectedRef.current;
    if (!container || !el) return;
    container.scrollTop =
      el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-1 overflow-y-auto p-2 scrollbar-thin"
    >
      {values.map((v) => {
        const isSelected = selected === v;
        return (
          <Button
            key={v}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            size="sm"
            variant={isSelected ? "default" : "ghost"}
            className="h-10 w-10 shrink-0 justify-center text-sm tabular-nums"
            onClick={() => onSelect(v)}
          >
            {pad(v)}
          </Button>
        );
      })}
    </div>
  );
}
