import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  renderMessageTemplate,
  buildWhatsappUrl,
  WhatsAppLinkSender,
} from "../whatsapp";

describe("normalizePhone", () => {
  it("converts a leading 0 to 62 and strips separators", () => {
    expect(normalizePhone("0812-3456 7890")).toBe("6281234567890");
  });
  it("strips a leading + and keeps 62", () => {
    expect(normalizePhone("+62 812 3456")).toBe("628123456");
  });
  it("keeps an already-62 number", () => {
    expect(normalizePhone("628123456")).toBe("628123456");
  });
  it("prefixes 62 when starting with 8", () => {
    expect(normalizePhone("8123456")).toBe("628123456");
  });
});

describe("renderMessageTemplate", () => {
  it("replaces all {nama} and {link} placeholders", () => {
    const out = renderMessageTemplate("Halo {nama}, buka {link} ya {nama}", {
      nama: "Budi",
      link: "https://x/abc",
    });
    expect(out).toBe("Halo Budi, buka https://x/abc ya Budi");
  });
});

describe("buildWhatsappUrl", () => {
  it("normalizes the phone and url-encodes the message", () => {
    expect(buildWhatsappUrl("0812", "hi there")).toBe(
      "https://wa.me/62812?text=hi%20there",
    );
  });
});

describe("WhatsAppLinkSender", () => {
  it("builds a wa.me URL from a guest and a link (manual mode)", () => {
    const sender = new WhatsAppLinkSender("Halo {nama}: {link}");
    const url = sender.buildSendUrl(
      { name: "Budi", phoneNumber: "0812", slug: "abc" },
      "https://x/abc",
    );
    expect(sender.mode).toBe("manual");
    expect(url).toBe("https://wa.me/62812?text=" + encodeURIComponent("Halo Budi: https://x/abc"));
  });
});
