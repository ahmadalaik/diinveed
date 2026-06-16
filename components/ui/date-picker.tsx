"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Parse a `YYYY-MM-DD` string into a local Date (avoids UTC shift). */
function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

/** Serialize a Date back to `YYYY-MM-DD`. */
function toValue(date?: Date): string {
  return date ? format(date, "yyyy-MM-dd") : "";
}

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  /** How many years before the current year to allow. Defaults to 5. */
  yearsBack?: number;
  /** How many years after the current year to allow. Defaults to 10. */
  yearsForward?: number;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  id,
  className,
  yearsBack = 5,
  yearsForward = 10,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = toDate(value);

  const currentYear = new Date().getFullYear();
  const startMonth = new Date(currentYear - yearsBack, 0);
  const endMonth = new Date(currentYear + yearsForward, 11);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "w-full min-w-0 justify-between font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selected
              ? format(selected, "d MMMM yyyy", { locale: idLocale })
              : placeholder}
          </span>
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          startMonth={startMonth}
          endMonth={endMonth}
          captionLayout="dropdown"
          locale={idLocale}
          onSelect={(date) => {
            onChange?.(toValue(date));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
