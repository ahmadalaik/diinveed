import { FieldGroup } from "@/components/ui/field";
import { QuoteField, QuoteReferenceField } from "./quote-field";

export function QuoteSection() {
  return (
    <FieldGroup className="py-4">
      <QuoteField />
      <QuoteReferenceField />
    </FieldGroup>
  );
}
