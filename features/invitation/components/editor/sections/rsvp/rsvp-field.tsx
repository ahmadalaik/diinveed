"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorError, EditorField, EditorLabel } from "../../editor-field";

export function RsvpDeadlineField() {
  const rsvpDeadline = useInvitationStore((s) => s.rsvpDeadline);
  const errors = useInvitationStore((s) => s.publishErrors?.rsvpDeadline);
  const set = useInvitationStore((s) => s.set);

  return (
    <EditorField publishField="rsvpDeadline" invalid={Boolean(errors?.length)}>
      <EditorLabel htmlFor="rsvp-deadline">Tenggat Waktu RSVP</EditorLabel>
      <DatePicker
        id="rsvp-deadline"
        value={rsvpDeadline}
        aria-invalid={Boolean(errors?.length)}
        onChange={(date) => set({ rsvpDeadline: date })}
        yearsBack={0}
        yearsForward={5}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
      <EditorError errors={errors} />
    </EditorField>
  );
}
