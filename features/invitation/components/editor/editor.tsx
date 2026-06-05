import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { AccordionSection } from "./accordion-section";
import { useInvitationStore } from "../../store/invitation-store";
import { Input } from "@/components/ui/input";

function SaveIndicator() {
  const saveStatus = useInvitationStore((s) => s.saveStatus);
  const lastSaved = useInvitationStore((s) => s.lastSaved);

  if (saveStatus === "saving")
    return <span className="text-xs">Saving...</span>;
  if (saveStatus === "saved" && lastSaved)
    return (
      <span className="text-xs text-muted-foreground">
        Auto-saved · just now
      </span>
    );
  if (saveStatus === "unsaved")
    return <span className="text-xs text-amber-500">Unsaved changes</span>;
  return null;
}

function TitleInput() {
  const title = useInvitationStore((s) => s.title);
  const set = useInvitationStore((s) => s.set);
  return (
    <Input
      value={title}
      onChange={(e) => set({ title: e.target.value })}
      placeholder="Invitation title"
      className="border-none shadow-none px-0 text-sm font-medium focus-visible:ring-0"
    />
  );
}

function TitleAndIndicator() {
  return (
    <div className="border-t border-b px-4 py-2 space-y-1">
      <TitleInput />
      <SaveIndicator />
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
      <SidebarHeader className="px-0">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0 leading-none">
                  <span className="text-sm font-semibold">Diinveed</span>
                  <span className="text-[10px] text-muted-foreground">
                    Invitation Studio
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <TitleAndIndicator />
      </SidebarHeader>
      <SidebarContent>
        <AccordionSection />
      </SidebarContent>
    </Sidebar>
  );
}
