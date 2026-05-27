"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";

export function BasicsSection() {
  const { title, subtitle, date, time, hosts, message, set } =
    useInvitationStore();

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Couple Name</Label>
        <Input
          value={title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="Amelia & Theo"
        />
      </div>
      <div>
        <Label className="text-xs">Tagline</Label>
        <Input
          value={subtitle}
          onChange={(e) => set({ subtitle: e.target.value })}
          placeholder="are getting married"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => set({ date: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => set({ time: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label className="text-xs">Hosts</Label>
        <Input
          value={hosts}
          onChange={(e) => set({ hosts: e.target.value })}
          placeholder="The families"
        />
      </div>
      <div>
        <Label className="text-xs">Message</Label>
        <Textarea
          value={message}
          onChange={(e) => set({ message: e.target.value })}
          placeholder="Join us to celebrate…"
          rows={3}
        />
      </div>
    </div>
  );
}
