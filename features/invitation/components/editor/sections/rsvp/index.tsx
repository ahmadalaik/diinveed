import { FieldGroup } from "@/components/ui/field";
import { RsvpDeadlineField } from "./rsvp-field";

export function RsvpSection() {
  return (
    <FieldGroup className="gap-3">
      <RsvpDeadlineField />
    </FieldGroup>
  );
}
