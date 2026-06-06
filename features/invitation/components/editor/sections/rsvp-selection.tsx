"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { RsvpOptions } from "@/features/invitation/types/invitation.type";

const OPTIONS: { key: keyof RsvpOptions; label: string }[] = [
  { key: "accept", label: "Accept" },
  { key: "decline", label: "Decline" },
  { key: "maybe", label: "Maybe" },
  { key: "plusOne", label: "Plus One" },
];

export function RsvpSection() {
  const rsvpDeadline = useInvitationStore((s) => s.rsvpDeadline);
  const opts = useInvitationStore((s) => s.rsvpOptions);
  const set = useInvitationStore((s) => s.set);

  const toggleOpt = (key: keyof RsvpOptions) => {
    set({ rsvpOptions: { ...opts, [key]: !opts[key] } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">RSVP Deadline</Label>
        <DatePicker
          value={rsvpDeadline}
          onChange={(value) => set({ rsvpDeadline: value })}
          yearsBack={1}
          yearsForward={2}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Response Options</Label>
        {OPTIONS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <Switch
              checked={opts[key]}
              onCheckedChange={() => toggleOpt(key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
