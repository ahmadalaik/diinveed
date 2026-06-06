import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { AccordionSection } from "./accordion-section";
import { useInvitationStore } from "../../store/invitation-store";
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

interface Props {
  onPublish: () => void;
}

export function Editor({ onPublish }: Props) {
  return (
    <Sidebar
      collapsible="none"
      className="w-full border-r bg-background md:w-(--sidebar-width)"
    >
      <SidebarHeader className="border-b p-2">
        <div className="flex items-center gap-2">
          <Brand />
          <TitleInput />
          <SaveDot />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <AccordionSection />
      </SidebarContent>
    </Sidebar>
  );
}
