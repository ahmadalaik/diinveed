"use client";

import { renderMessageTemplate } from "../../lib/whatsapp";
import { renderWhatsappFormatting } from "../../lib/wa-format";

const SAMPLE_NAME = "Budi";
const SAMPLE_LINK = "https://diinveed.com/u/contoh";

/** A WhatsApp-style chat bubble showing the message with sample values. */
export function WhatsappPreview({ message }: { message: string }) {
  const rendered = renderMessageTemplate(message || "", {
    nama: SAMPLE_NAME,
    link: SAMPLE_LINK,
  });

  return (
    <div className="rounded-lg bg-[#e5ddd5] p-3 dark:bg-zinc-800">
      <div className="ml-auto max-w-[85%] rounded-lg rounded-tr-sm bg-[#dcf8c6] px-3 py-2 shadow-sm dark:bg-emerald-900">
        <p className="text-sm leading-relaxed wrap-break-word text-zinc-800 dark:text-zinc-100">
          {message.trim() ? (
            renderWhatsappFormatting(rendered)
          ) : (
            <span className="text-zinc-500 italic">Pesan masih kosong…</span>
          )}
        </p>
      </div>
    </div>
  );
}
