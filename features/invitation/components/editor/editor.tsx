import { Copy, GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AccordionSection } from "./accordion-section";
import { useInvitationStore } from "../../store/invitation-store";
import {
  publishInvitation,
  unpublishInvitation,
} from "../../actions/publish-invitation";
import { buildInvitationSlug } from "../../lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function SaveDot() {
  const saveStatus = useInvitationStore((s) => s.saveStatus);
  const lastSaved = useInvitationStore((s) => s.lastSaved);

  const getLabel = () => {
    if (saveStatus === "saving") return "Saving...";
    if (saveStatus === "unsaved") return "Unsaved changes";
    if (lastSaved) return "Auto-saved · just now";
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
  const slug = useInvitationStore((s) => s.slug);
  const publicToken = useInvitationStore((s) => s.publicToken);
  const set = useInvitationStore((s) => s.set);

  const [loading, setLoading] = useState(false);
  const [liveSlug, setLiveSlug] = useState(() =>
    isPublished && publicToken ? buildInvitationSlug(slug, publicToken) : "",
  );

  async function handlePublish() {
    setLoading(true);
    const result = await publishInvitation();
    setLoading(false);

    if (result.errors) {
      const messages = Object.values(result.errors)
        .flat()
        .filter(Boolean) as string[];
      toast.error(messages[0] ?? "Gagal mempublikasikan undangan.");
      return;
    }

    setLiveSlug(result.invitationSlug);
    set({ isPublished: true });
    toast.success("Undangan dipublikasikan.", {
      action: {
        label: "Salin tautan",
        onClick: () =>
          navigator.clipboard.writeText(
            `${window.location.origin}/invitation/${result.invitationSlug}`,
          ),
      },
    });
  }

  async function handleUnpublish() {
    setLoading(true);
    const result = await unpublishInvitation();
    setLoading(false);

    if (result.errors) {
      toast.error(result.errors._form[0] ?? "Gagal menyembunyikan undangan.");
      return;
    }
    set({ isPublished: false });
    toast.success("Undangan disembunyikan.");
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
    <div className="flex items-center gap-2 border-t p-2">
      <Button variant="outline" className="flex-1" onClick={handleCopy}>
        <Copy className="size-4" />
        Salin tautan
      </Button>
      <Button variant="ghost" onClick={handleUnpublish} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Unpublish"}
      </Button>
    </div>
  );
}

export function Editor() {
  return (
    <aside className="flex h-full w-full flex-col border-r bg-background md:w-[30%]">
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
