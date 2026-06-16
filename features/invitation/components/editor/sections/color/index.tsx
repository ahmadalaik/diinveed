import { ColorBackgroundField, ColorTextField, ColorButtonField } from "./color-field";

export function ColorSection() {
  return (
    <div className="space-y-6">
      <ColorBackgroundField />
      <ColorTextField />
      <ColorButtonField />
    </div>
  );
}
