import type { TemplateComponent } from "../components/templates/types";
import KelanaTemplate from "../components/templates/kelana";

export const TEMPLATES: Record<string, TemplateComponent> = {
  kelana: KelanaTemplate,
};

export const DEFAULT_TEMPLATE_SLUG = "kelana";

export function getTemplate(slug: string): TemplateComponent {
  return TEMPLATES[slug] ?? TEMPLATES[DEFAULT_TEMPLATE_SLUG];
}
