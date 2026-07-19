import type { TemplateComponent } from "../components/templates/types";
import KalandraTemplate from "../components/templates/elegant/kalandra";
import DikaraTemplate from "../components/templates/elegant/dikara";
import PradiptaTemplate from "../components/templates/elegant/pradipta";

export const TEMPLATES: Record<string, TemplateComponent> = {
  kalandra: KalandraTemplate,
  dikara: DikaraTemplate,
  pradipta: PradiptaTemplate,
};

export const DEFAULT_TEMPLATE_SLUG = "kalandra";

/** Returns a slug guaranteed to be a registered template key. */
export function resolveTemplateSlug(slug: string): string {
  return Object.hasOwn(TEMPLATES, slug) ? slug : DEFAULT_TEMPLATE_SLUG;
}

export function GetTemplate(slug: string): TemplateComponent {
  return TEMPLATES[resolveTemplateSlug(slug)];
}
