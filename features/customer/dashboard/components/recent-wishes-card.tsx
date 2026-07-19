import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentWish } from "../types/dashboard.type";

export function RecentWishesCard({
  recent,
  pendingCount,
}: {
  recent: RecentWish[];
  pendingCount: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Ucapan Terbaru</CardTitle>
        {pendingCount > 0 && (
          <Badge variant="secondary">{pendingCount} menunggu moderasi</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada ucapan masuk.</p>
        ) : (
          <ul className="space-y-3">
            {recent.map((w) => (
              <li key={w.id} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{w.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(w.createdAt), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {w.wish}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href="/rsvp">Lihat semua</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
