import { Accordion } from "@/components/ui/accordion";
import {
  ColorBackgroundField,
  ColorButtonField,
  ColorTextField,
} from "./color-field";

export function ColorSection() {
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["text", "button", "background"]}
    >
      <ColorBackgroundField />
      <ColorTextField />
      <ColorButtonField />
    </Accordion>
  );
}
