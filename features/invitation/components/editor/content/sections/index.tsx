"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { CATEGORIZED_SECTIONS } from "@/features/invitation/configs/sections";
import { ChevronRight } from "lucide-react";
import { useInvitationStore } from "@/features/invitation/store/invitation-store-provider";
import { useMemo, useState } from "react";

export function AccordionSection() {
  const publishErrors = useInvitationStore((s) => s.publishErrors);
  const [value, setValue] = useState<string[]>(["basics"]);
  const [seenErrors, setSeenErrors] = useState(publishErrors);

  const errorSections = useMemo(() => {
    if (!publishErrors) return new Set<string>();

    const allItems = CATEGORIZED_SECTIONS.flatMap((c) => c.items);
    return new Set(
      allItems
        .filter((s) => s.fields?.some((f) => publishErrors[f]?.length))
        .map((s) => s.value),
    );
  }, [publishErrors]);

  if (publishErrors !== seenErrors) {
    setSeenErrors(publishErrors);
    if (errorSections.size > 0) {
      setValue((prev) => Array.from(new Set([...prev, ...errorSections])));
    }
  }

  return (
    <Accordion
      type="multiple"
      className="gap-3.5"
      value={value}
      onValueChange={setValue}
    >
      {CATEGORIZED_SECTIONS.map(({ category, items }) => (
        <div key={category} className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase font-semibold px-1">
            {category}
          </span>
          {items.map(({ value, label, summary, Icon, Content }) => (
            <AccordionItem
              key={value}
              value={value}
              className="rounded-xl border border-zinc-200/80 bg-white transition hover:border-zinc-300 overflow-hidden"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between p-3.5 text-left text-sm font-medium transition-all outline-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-950 flex items-center gap-2">
                        {label}
                        {errorSections.has(value) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        )}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {summary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-zinc-400 w-4 h-4 shrink-0 transition-transform duration-200 in-data-open:rotate-90" />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionContent className="px-4 pb-4 pt-1 bg-zinc-50/50 border-t border-zinc-100">
                <Content />
              </AccordionContent>
            </AccordionItem>
          ))}
        </div>
      ))}
    </Accordion>
  );
}
