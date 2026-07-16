import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { actionLabel, domainBadgeClass } from "../configs/audit-actions";

export function ActionBadge({ action }: { action: string }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", domainBadgeClass(action))}>
      {actionLabel(action)}
    </Badge>
  );
}
