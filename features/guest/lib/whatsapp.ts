/** Normalize an Indonesian phone number to wa.me digits (62...). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

/** Replace {nama} and {link} placeholders (all occurrences). */
export function renderMessageTemplate(
  template: string,
  vars: { nama: string; link: string },
): string {
  return template
    .split("{nama}")
    .join(vars.nama)
    .split("{link}")
    .join(vars.link);
}

/** Build a click-to-chat wa.me URL with a prefilled, encoded message. */
export function buildWhatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}

export type GuestForSend = {
  name: string;
  phoneNumber: string | null;
  slug: string;
};

/**
 * Seam for delivering invitations. Manual implementation returns a click-to-send
 * URL; a future API provider would implement an async `send` instead.
 */
export interface InvitationSender {
  readonly mode: "manual" | "api";
  buildSendUrl(guest: GuestForSend, link: string): string;
}

export class WhatsAppLinkSender implements InvitationSender {
  readonly mode = "manual" as const;
  constructor(private template: string) {}

  buildSendUrl(guest: GuestForSend, link: string): string {
    const message = renderMessageTemplate(this.template, {
      nama: guest.name,
      link,
    });
    return buildWhatsappUrl(guest.phoneNumber ?? "", message);
  }
}
