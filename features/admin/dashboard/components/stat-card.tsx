import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Delta } from "../lib/dashboard-helpers";

export function StatCard({
  label,
  value,
  icon,
  subtitle,
  delta,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: React.ReactNode;
  delta?: Delta;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {delta && delta.pct !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                delta.direction === "up" && "text-emerald-600",
                delta.direction === "down" && "text-destructive"
              )}
            >
              {delta.direction === "up" && <ArrowUp className="h-3 w-3" />}
              {delta.direction === "down" && <ArrowDown className="h-3 w-3" />}
              {delta.pct > 0 ? "+" : ""}
              {delta.pct}%
            </span>
          )}
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}
