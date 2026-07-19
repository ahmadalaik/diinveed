"use client";

import { Input } from "@/components/ui/input";
import { useInvitationStore } from "@/features/invitation/store/invitation-store-provider";

export function HeaderTitle() {
  const title = useInvitationStore((s) => s.title);
  const errors = useInvitationStore((s) => s.publishErrors?.title);
  const set = useInvitationStore((s) => s.set);

  return (
    <Input
      data-publish-field="title"
      value={title}
      onChange={(e) => set({ title: e.target.value })}
      aria-invalid={Boolean(errors?.length)}
      aria-label="Judul undangan"
      placeholder="Judul Undangan"
      className="h-8 max-w-30 sm:max-w-50 text-xs sm:text-sm font-semibold text-zinc-900 border-none bg-transparent hover:bg-zinc-100/80 focus:bg-white focus:ring-1 focus:ring-zinc-300 rounded-md transition-all shadow-none focus-visible:ring-1 focus-visible:ring-zinc-300 truncate"
    />
  );
}
