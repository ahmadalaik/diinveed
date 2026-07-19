"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useInvitationStore } from "@/features/invitation/store/invitation-store-provider";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Check, Clock3, Loader2 } from "lucide-react";

export function HeaderSaveStatusIndicator() {
  const saveStatus = useInvitationStore((s) => s.saveStatus);
  const lastSaved = useInvitationStore((s) => s.lastSaved);

  const getStatusContent = (
    status: "saved" | "saving" | "unsaved",
    lastSaved: Date | null,
  ) => {
    switch (status) {
      case "saving":
        return {
          label: "Menyimpan...",
          tooltip: "Perubahan sedang disimpan",
        };
      case "unsaved":
        return {
          label: "Belum disimpan",
          tooltip: "Perubahan akan disimpan otomatis",
        };
      case "saved":
        return {
          label: "Tersimpan",
          tooltip: lastSaved
            ? `Tersimpan ${formatDistanceToNow(lastSaved, { addSuffix: true, locale: idLocale })}`
            : "Semua perubahan tersimpan",
        };
    }
  };

  const { tooltip } = getStatusContent(saveStatus, lastSaved);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 ml-1">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 shrink-0" />
                <span className="text-zinc-500">Menyimpan...</span>
              </>
            ) : saveStatus === "unsaved" ? (
              <>
                <Clock3 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-amber-600 font-semibold">
                  Belum Disimpan
                </span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-emerald-600">Tersimpan</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
