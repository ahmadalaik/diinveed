"use client";

import { RefObject, useState } from "react";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { getToken } from "@/features/template/tokens";
import {
  publishInvitation,
  unpublishInvitation,
} from "@/features/invitation/actions/publish-invitation";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Check,
  Copy,
  ExternalLink,
  Minus,
  Monitor,
  Plus,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeviceFrame } from "./device-frame";
import { getTemplate } from "@/features/template/registry/templates";
import { RsvpResponsesPanel } from "./rsvp-responses-panel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type DeviceType = "dekstop" | "tablet" | "mobile";

type Props = {
  cardRef: RefObject<HTMLDivElement | null>;
};

export function InvitationPreview({ cardRef }: Props) {
  const state = useInvitationStore();
  const set = useInvitationStore((s) => s.set);

  const [device, setDevice] = useState<DeviceType>("dekstop");
  const [zoom, setZoom] = useState(100);
  const [responsesOpen, setResponsesOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const Template = getTemplate(state.templateSlug);

  const token = getToken(state.tokenId);
  const tokenName = token?.name ?? state.tokenId;
  const headingFont =
    state.tokenOverrides?.typography?.heading ??
    token?.typography.heading ??
    "";

  const handlePublish = async () => {
    if (state.isPublished) {
      await unpublishInvitation();
      set({ isPublished: false });
    } else {
      const result = await publishInvitation();
      if (result.token) {
        set({ isPublished: true });
        setPublishedUrl(`${window.location.origin}/rsvp/${result.token}`);
      }
    }
  };

  const handleCopy = async () => {
    if (!publishedUrl) return;
    await navigator.clipboard.writeText(publishedUrl).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 flex-col bg-muted/30 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <span className="text-sm text-muted-foreground flex-1">
          Invitation Editor
          {state.isPublished && (
            <Badge variant="secondary" className="ml-2">
              Published
            </Badge>
          )}
        </span>
        <ToggleGroup
          type="single"
          value={device}
          onValueChange={(v) => {
            if (v) setDevice(v as DeviceType);
          }}
          className="border rounded-md"
        >
          <ToggleGroupItem
            value="desktop"
            className="px-2 py-1.5 rounded-l-md rounded-r-none"
          >
            <Monitor className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="tablet" className="px-2 py-1.5 rounded-none">
            <Tablet className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="mobile"
            className="px-2 py-1.5 rounded-l-none rounded-r-md"
          >
            <Smartphone className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-1 border rounded-md px-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs w-10 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setResponsesOpen(true)}
        >
          Responses
        </Button>
        <Button size="sm" onClick={handlePublish}>
          {state.isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>

      {/* Canvas — cardRef attached here so applyTokens CSS vars scope to preview */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-center">
        <div
          ref={cardRef}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <DeviceFrame device={device}>
            <Template invitation={state} />
          </DeviceFrame>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 border-t bg-background px-4 py-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Live preview
        </span>
        <span>Theme: {tokenName}</span>
        <span>Font: {headingFont}</span>
        <a
          href={`/rsvp/${state.token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 hover:text-foreground"
        >
          Open in new tab <ExternalLink className="h-3 w-3" />
        </a>
        <span>⌘S to save</span>
      </div>

      <RsvpResponsesPanel
        open={responsesOpen}
        onOpenChange={setResponsesOpen}
      />

      {/* Publish success dialog */}
      <Dialog
        open={!!publishedUrl}
        onOpenChange={(v) => {
          if (!v) setPublishedUrl(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your invitation is live!</DialogTitle>
            <DialogDescription>
              Share this link with your guests.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Input
              value={publishedUrl ?? ""}
              readOnly
              className="flex-1 text-sm"
            />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
