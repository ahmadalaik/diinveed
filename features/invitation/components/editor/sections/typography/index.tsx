import {
  TypographyHeadingField,
  TypographyBodyField,
} from "./typography-field";

export function FontSection() {
  return (
    <div className="space-y-6">
      <TypographyHeadingField />
      <TypographyBodyField />
    </div>
  );
}
