import {
  TypographyBodyField,
  TypographyHeadingField,
} from "./typography-field";

export function FontSection() {
  return (
    <div className="space-y-6 py-4">
      <TypographyHeadingField />
      <TypographyBodyField />
    </div>
  );
}
