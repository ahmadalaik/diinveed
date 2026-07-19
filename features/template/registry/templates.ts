import type { TemplateComponent } from "../components/templates/types";
import KalandraTemplate from "../components/templates/elegant/kalandra";
import AdhikariTemplate from "../components/templates/adhikari";
import AgnimayaTemplate from "../components/templates/agnimaya";
import RenjanaTemplate from "../components/templates/renjana";
import DikaraTemplate from "../components/templates/elegant/dikara";
import PavanaTemplate from "../components/templates/pavana";
import PradiptaTemplate from "../components/templates/elegant/pradipta";
import SamiraTemplate from "../components/templates/samira";
import SakuraReverieTemplate from "../components/templates/sakura-reverie";
import SakuraReverieCodexTemplate from "../components/templates/sakura-reverie-codex";
import TamanNusantaraTemplate from "../components/templates/taman-nusantara";
import LarasatiTemplate from "../components/templates/larasati";
// import GhibliTemplate from "../components/templates/ghibli";
import JavaneseEngravingTemplate from "../components/templates/javanese-engraving";
import ArunikaTemplate from "../components/templates/arunika";
import CinematicNatureTemplate from "../components/templates/cinematic-nature";
import GhibliTemplate from "../components/templates/interaktif/ghibli";
import SakuraReverieGemini from "../components/templates/sakura-reverie-gemini";
import WindRisesTemplate from "../components/templates/interaktif/wind-rises";

export const TEMPLATES: Record<string, TemplateComponent> = {
  kalandra: KalandraTemplate,
  adhikari: AdhikariTemplate,
  agnimaya: AgnimayaTemplate,
  renjana: RenjanaTemplate,
  dikara: DikaraTemplate,
  pavana: PavanaTemplate,
  pradipta: PradiptaTemplate,
  samira: SamiraTemplate,
  "sakura-reverie": SakuraReverieTemplate,
  "sakura-reverie-codex": SakuraReverieCodexTemplate,
  "sakura-gemini": SakuraReverieGemini,
  "taman-nusantara": TamanNusantaraTemplate,
  // ghibli: GhibliTemplate,
  larasati: LarasatiTemplate,
  "javanese-engraving": JavaneseEngravingTemplate,
  arunika: ArunikaTemplate,
  "cinematic-nature": CinematicNatureTemplate,
  "ghibli-wind": GhibliTemplate,
  "wind-rises": WindRisesTemplate,
};

export const DEFAULT_TEMPLATE_SLUG = "kalandra";

/** Returns a slug guaranteed to be a registered template key. */
export function resolveTemplateSlug(slug: string): string {
  return Object.hasOwn(TEMPLATES, slug) ? slug : DEFAULT_TEMPLATE_SLUG;
}

export function GetTemplate(slug: string): TemplateComponent {
  return TEMPLATES[resolveTemplateSlug(slug)];
}
