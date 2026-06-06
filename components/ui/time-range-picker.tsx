"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Indonesian time zones, used as the default options. */
export const TIMEZONES = ["WIB", "WITA", "WIT"];

interface TimeRangePickerProps {
  start?: string;
  end?: string;
  timezone?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  onTimezoneChange?: (value: string) => void;
  timezones?: string[];
  /** Applied to the start/end triggers and the timezone select trigger. */
  className?: string;
  startId?: string;
}

export function TimeRangePicker({
  start,
  end,
  timezone,
  onStartChange,
  onEndChange,
  onTimezoneChange,
  timezones = TIMEZONES,
  className,
  startId,
}: TimeRangePickerProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex-1">
          <TimePicker
            id={startId}
            value={start}
            onChange={onStartChange}
            className={className}
          />
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">–</span>
        <div className="flex-1">
          <TimePicker value={end} onChange={onEndChange} className={className} />
        </div>
      </div>
      <Select value={timezone || undefined} onValueChange={onTimezoneChange}>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder="Zona waktu" />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
