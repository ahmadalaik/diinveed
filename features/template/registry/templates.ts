import type { TemplateComponent } from "../components/templates/types";
import KelanaTemplate from "../components/templates/kelana";
import TerracottaTemplate from "../components/templates/terracotta";
import AgnimayaTemplate from "../components/templates/agnimaya";
import RenjanaTemplate from "../components/templates/renjana";

export const TEMPLATES: Record<string, TemplateComponent> = {
  kelana: KelanaTemplate,
  terracotta: TerracottaTemplate,
  agnimaya: AgnimayaTemplate,
  renjana: RenjanaTemplate,
};

export const DEFAULT_TEMPLATE_SLUG = "kelana";

/** Returns a slug guaranteed to be a registered template key. */
export function resolveTemplateSlug(slug: string): string {
  return Object.hasOwn(TEMPLATES, slug) ? slug : DEFAULT_TEMPLATE_SLUG;
}

export function GetTemplate(slug: string): TemplateComponent {
  return TEMPLATES[resolveTemplateSlug(slug)];
}
