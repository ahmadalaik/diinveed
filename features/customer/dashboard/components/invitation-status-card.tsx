import Link from "next/link";
import { ExternalLink, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/features/invitation/lib/datetime";
import { daysUntil } from "../lib/next-event";
import type { DashboardSummary } from "../types/dashboard.type";
import { CopyLinkButton } from "./copy-link-button";

export function InvitationStatusCard({ summary }: { summary: DashboardSummary }) {
  const { coupleName, isPublished, slug, nextEventDate } = summary.invitation;
  const hasPublicLink = isPublished && slug !== "";
  const publicPath = `/invitation/${slug}`;
  const daysLeft = nextEventDate ? daysUntil(nextEventDate) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">
            {coupleName || "Undangan kamu"}
          </CardTitle>
          {nextEventDate && daysLeft !== null && (
            <p className="text-sm text-muted-foreground">
              {daysLeft === 0 ? "Hari ini hari-H!" : `${daysLeft} hari lagi`}
              {" · "}
              {formatDate(nextEventDate, "PPPP")}
            </p>
          )}
        </div>
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Dipublikasikan" : "Draf"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPublicLink ? (
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-sm">
              {publicPath}
            </code>
            <CopyLinkButton path={publicPath} />
            <Button variant="outline" size="sm" asChild>
              <a href={publicPath} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Buka
              </a>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Undangan belum dipublikasikan.
          </p>
        )}
        <Button variant={isPublished ? "outline" : "default"} size="sm" asChild>
          <Link href="/invitation/edit">
            <PencilLine />
            Lengkapi undangan
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
