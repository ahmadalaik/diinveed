import type { WhatsappSource } from "../config/landing-content";

interface WhatsappContext {
  readonly source: WhatsappSource;
  readonly templateName?: string;
}

const INTERNATIONAL_PHONE = /^[1-9]\d{8,14}$/;

export function buildMarketingWhatsappUrl(
  phone: string,
  context: WhatsappContext,
): string {
  if (!INTERNATIONAL_PHONE.test(phone)) {
    throw new Error("WhatsApp number must use international digits");
  }

  const templateSentence = context.templateName
    ? ` Saya tertarik dengan template ${context.templateName}.`
    : " Saya ingin melihat template yang tersedia.";
  const sourceSentence =
    context.source === "pricing"
      ? " Saya melihat bagian harga di website."
      : " Saya melihat website diinveed.";
  const message =
    "Halo diinveed, saya tertarik dengan Paket Lengkap Rp149.000." +
    templateSentence +
    sourceSentence;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
