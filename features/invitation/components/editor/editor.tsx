import { Copy, GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AccordionSection } from "./accordion-section";
import { useInvitationStore } from "../../store/invitation-store";
import {
  publishInvitation,
  unpublishInvitation,
} from "../../actions/publish-invitation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: idLocale });
}

function SaveDot() {
  const saveStatus = useInvitationStore((s) => s.saveStatus);
  const lastSaved = useInvitationStore((s) => s.lastSaved);

  const getLabel = () => {
    if (saveStatus === "saving") return "Menyimpan...";
    if (saveStatus === "unsaved") return "Perubahan belum disimpan";
    if (lastSaved) return `Tersimpan · ${relativeTime(lastSaved)}`;
    return null;
  };

  const label = getLabel();
  if (!label) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex size-6 shrink-0 items-center justify-center">
            {saveStatus === "saving" ? (
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
            ) : (
              <span
                className={cn(
                  "size-2 rounded-full",
                  saveStatus === "unsaved" ? "bg-amber-500" : "bg-emerald-500",
                )}
              />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TitleInput() {
  const title = useInvitationStore((s) => s.title);
  const set = useInvitationStore((s) => s.set);
  return (
    <Input
      value={title}
      onChange={(e) => set({ title: e.target.value })}
      placeholder="Invitation title"
      className="h-auto border-none px-0 py-0 text-sm font-medium shadow-none focus-visible:ring-0"
    />
  );
}

function Brand() {
  return (
    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
      <GalleryVerticalEnd className="size-4" />
    </div>
  );
}

function PublishFooter() {
  const isPublished = useInvitationStore((s) => s.isPublished);
  const set = useInvitationStore((s) => s.set);
  const setPublishErrors = useInvitationStore((s) => s.setPublishErrors);
  const liveSlug = useInvitationStore((s) => s.liveSlug);
  const setLiveSlug = useInvitationStore((s) => s.setLiveSlug);
  const hasUnpublishedChanges = useInvitationStore(
    (s) => s.hasUnpublishedChanges,
  );
  const setHasUnpublishedChanges = useInvitationStore(
    (s) => s.setHasUnpublishedChanges,
  );

  const [loading, setLoading] = useState(false);

  async function handlePublish() {
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
  }

  async function handleUnpublish() {
    setLoading(true);
    const result = await unpublishInvitation();
    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    set({ isPublished: false });
    toast.success(result.message);
  }

  async function handleCopy() {
    if (!liveSlug) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/invitation/${liveSlug}`,
    );
    toast.success("Tautan disalin.");
  }

  if (!isPublished) {
    return (
      <div className="border-t p-2">
        <Button className="w-full" onClick={handlePublish} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Publish"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t p-2">
      {hasUnpublishedChanges && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Ada perubahan belum dipublikasikan</Badge>
          <Button
            size="sm"
            className="ml-auto"
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Publikasikan perubahan"
            )}
          </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="outline" className="flex-1" onClick={handleCopy}>
          <Copy className="size-4" />
          Salin tautan
        </Button>
        <Button variant="ghost" onClick={handleUnpublish} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Unpublish"}
        </Button>
      </div>
    </div>
  );
}

export function Editor() {
  return (
    <aside className="flex h-full w-full flex-col border-r bg-sidebar md:w-[30%]">
      <div className="border-b p-2">
        <div className="flex items-center gap-2">
          <Brand />
          <TitleInput />
          <SaveDot />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <AccordionSection />
      </div>
      <PublishFooter />
    </aside>
  );
}
