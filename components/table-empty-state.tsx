import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type TableEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function TableEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: TableEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
        <div className="bg-muted text-muted-foreground grid size-14 place-items-center rounded-full">
          <Icon className="size-6" />
        </div>
        <h3 className="text-base font-medium">{title}</h3>
        <p className="text-muted-foreground max-w-xs text-sm">{description}</p>
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  );
}
