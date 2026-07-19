"use client";

import { Button } from "@/components/ui/button";
import {
  publishInvitation,
  unpublishInvitation,
} from "@/features/invitation/actions/publish-invitation";
import { useInvitationStore } from "@/features/invitation/store/invitation-store-provider";
import { Copy, ExternalLink, Loader2, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function HeaderPublishButton() {
  const isPublished = useInvitationStore((s) => s.isPublished);
  const setPublishErrors = useInvitationStore((s) => s.setPublishErrors);
  const setHasUnpublishedChanges = useInvitationStore(
    (s) => s.setHasUnpublishedChanges,
  );
  const liveSlug = useInvitationStore((s) => s.liveSlug);
  const setLiveSlug = useInvitationStore((s) => s.setLiveSlug);
  const set = useInvitationStore((s) => s.set);

  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    const result = await publishInvitation();
    setLoading(false);

    if (!result.success) {
      setPublishErrors(result.errors ?? null);
      const firstFieldMsg = Object.values(result.errors ?? {})
        .flat()
        .filter(Boolean)[0] as string | undefined;
      toast.error(firstFieldMsg ?? result.message);
      return;
    }

    setPublishErrors(null);
    setHasUnpublishedChanges(false);
    setLiveSlug(result.data!.invitationSlug);
    set({ isPublished: true, slug: result.data!.invitationSlug });
    toast.success(result.message, {
      action: {
        label: "Salin tautan",
        onClick: () =>
          navigator.clipboard.writeText(
            `${window.location.origin}/invitation/${result.data!.invitationSlug}`,
          ),
      },
    });
  };

  const handleUnpublish = async () => {
    setLoading(true);
    const result = await unpublishInvitation();
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    set({ isPublished: false });
    toast.success(result.message);
  };

  if (!isPublished) {
    return (
      <Button
        size="sm"
        className="rounded-full px-3.5 sm:px-5 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 h-8 sm:h-9 cursor-pointer whitespace-nowrap shrink-0"
        onClick={handlePublish}
        disabled={loading}
      >
        <span>Publish</span>
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <MoveUpRight className="size-3.5" />
        )}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
      <Button
        variant="outline"
        size="sm"
        className="hidden lg:inline-flex rounded-full border-zinc-200 text-xs font-medium px-4 h-9 whitespace-nowrap shrink-0"
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.origin}/invitation/${liveSlug}`,
          )
        }
      >
        <Copy className="w-3.5 h-3.5 mr-1.5" />
        Salin Tautan
      </Button>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="hidden lg:inline-flex rounded-full border-zinc-200 text-xs font-medium px-4 h-9 whitespace-nowrap shrink-0"
      >
        <Link href={`/${liveSlug}`} target="_blank">
          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
          Preview Live
        </Link>
      </Button>
      <Button onClick={handleUnpublish} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Unpublish"}
      </Button>
    </div>
  );
}
