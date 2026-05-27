"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";

export function LocationSection() {
  const venueName = useInvitationStore((s) => s.venueName);
  const venueAddress = useInvitationStore((s) => s.venueAddress);
  const set = useInvitationStore((s) => s.set);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Venue Name</Label>
        <Input
          value={venueName}
          onChange={(e) => set({ venueName: e.target.value })}
          placeholder="The Grand Ballroom"
        />
      </div>
      <div>
        <Label className="text-xs">Address</Label>
        <Textarea
          value={venueAddress}
          onChange={(e) => set({ venueAddress: e.target.value })}
          placeholder="123 Main St, City"
          rows={2}
        />
      </div>
    </div>
  );
}
