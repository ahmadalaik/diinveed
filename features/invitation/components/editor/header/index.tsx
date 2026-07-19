import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { HeaderTitle } from "./header-title";
import { HeaderSaveStatusIndicator } from "./header-save-status-indicator";
import { HeaderPublishButton } from "./header-publish-button";

export function StudioHeader() {
  return (
    <header className="h-14 border-b border-muted bg-background px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 gap-2">
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
          </Link>
        </Button>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <HeaderTitle />
          <HeaderSaveStatusIndicator />
        </div>
      </div>

      <HeaderPublishButton />
    </header>
  );
}
