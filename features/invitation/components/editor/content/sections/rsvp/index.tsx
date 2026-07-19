import { FieldGroup } from "@/components/ui/field";
import { RsvpDeadlineField } from "./rsvp-field";

export function RsvpSection() {
  return (
    <FieldGroup className="py-4">
      <RsvpDeadlineField />
    </FieldGroup>
  );
}
