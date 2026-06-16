import { FieldGroup } from "@/components/ui/field";
import { QuoteField, QuoteReferenceField } from "./quote-field";

export function QuoteSection() {
  return (
    <FieldGroup className="gap-3">
      <QuoteField />
      <QuoteReferenceField />
    </FieldGroup>
  );
}
