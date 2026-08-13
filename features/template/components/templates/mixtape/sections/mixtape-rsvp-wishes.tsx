"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitRsvp } from "@/features/invitation/actions/submit-rsvp";
import type { RsvpFormType } from "@/features/invitation/schemas/rsvp.schema";
import type { InvitationState } from "@/features/invitation/types/invitation.type";
import type { TemplateMode } from "../../types";
import { Grain } from "../motifs/grain";
import { MixtapeHeading } from "../motifs/heading";
import { RsvpSessionSelector } from "@/features/invitation/components/rsvp/rsvp-session-selector";
import type { SessionOption } from "@/features/invitation/events/session.types";

type MixtapeRsvpWishesProps = {
  inv: InvitationState;
  mode: TemplateMode;
  guestSlug?: string;
  guestName?: string;
  sessions?: SessionOption[];
};

type Status = "idle" | "submitting" | "done";

const RESPONSE_LABELS: Record<RsvpFormType["response"], string> = {
  ACCEPT: "Hadir",
  DECLINE: "Tidak hadir",
  MAYBE: "Masih ragu",
};

export function MixtapeRsvpWishes({
  inv,
  mode,
  guestSlug,
  guestName,
  sessions = [],
}: MixtapeRsvpWishesProps) {
  const availableResponses = (
    ["ACCEPT", "DECLINE", "MAYBE"] as const
  ).filter((value) => {
    if (value === "ACCEPT") return inv.rsvpOptions.accept;
    if (value === "DECLINE") return inv.rsvpOptions.decline;
    return inv.rsvpOptions.maybe;
  });

  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState(guestName ?? "");
  // Default ke opsi kehadiran pertama yang benar-benar aktif — bukan "ACCEPT"
  // buta, yang akan merekam kehadiran meski pengantin mematikan opsi "hadir".
  // Kalau ketiganya dimatikan (kasus degenerate, tak ada radio yang tampil),
  // jatuh ke "ACCEPT" hanya agar tipenya valid dan komponen tidak crash.
  const [response, setResponse] = useState<RsvpFormType["response"]>(
    availableResponses[0] ?? "ACCEPT",
  );
  const [guests, setGuests] = useState("1");
  const [wish, setWish] = useState("");
  const [eventIds, setEventIds] = useState<string[]>([]);

  const wishesEnabled = inv.wishesOptions?.enabled ?? true;
  const isPreview = mode === "preview";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPreview) {
      toast.info("Ini pratinjau — konfirmasi tidak dikirim.");
      return;
    }

    setStatus("submitting");
    try {
      const result = await submitRsvp(
        inv.publicToken,
        { name, response, guests, wish, eventIds },
        guestSlug,
      );

      if (!result.success) {
        toast.error(result.message);
        setStatus("idle");
        return;
      }

      toast.success(result.message);
      setStatus("done");
    } catch {
      toast.error("Gagal mengirim konfirmasi. Coba lagi ya.");
      setStatus("idle");
    }
  }

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: "var(--tpl-bg-primary)",
        color: "var(--tpl-text-primary)",
      }}
    >
      <MixtapeHeading
        thin="Kirim doa dan"
        bold="konfirmasi kehadiranmu"
        className="text-3xl"
      />

      {status === "done" ? (
        <p className="relative z-10 mt-6 font-(family-name:--tpl-font-body)">
          Terima kasih, konfirmasimu sudah kami terima.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
          <div>
            <label
              htmlFor="mixtape-name"
              className="block text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]"
            >
              Nama
            </label>
            <input
              id="mixtape-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full border-b border-current bg-transparent py-2 font-(family-name:--tpl-font-body) outline-none"
            />
          </div>

          <fieldset>
            <legend className="text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]">
              Kehadiran
            </legend>
            <div className="mt-2 flex flex-wrap gap-4">
              {availableResponses.map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 font-(family-name:--tpl-font-body) text-sm"
                >
                  <input
                    type="radio"
                    name="response"
                    value={value}
                    checked={response === value}
                    onChange={() => {
                      setResponse(value);
                      if (value !== "ACCEPT") setEventIds([]);
                    }}
                  />
                  {RESPONSE_LABELS[value]}
                </label>
              ))}
            </div>
          </fieldset>

          {inv.rsvpOptions.plusOne ? (
            <div>
              <label
                htmlFor="mixtape-guests"
                className="block text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]"
              >
                Jumlah tamu
              </label>
              <input
                id="mixtape-guests"
                type="number"
                min="1"
                value={guests}
                onChange={(event) => setGuests(event.target.value)}
                className="mt-1 w-24 border-b border-current bg-transparent py-2 font-(family-name:--tpl-font-body) outline-none"
              />
            </div>
          ) : null}

          {/* {response === "ACCEPT" ? (
            <RsvpSessionSelector
              sessions={sessions}
              value={eventIds}
              onChange={setEventIds}
            />
          ) : null} */}

          {wishesEnabled ? (
            <div>
              <label
                htmlFor="mixtape-wish"
                className="block text-xs font-(family-name:--tpl-font-body) uppercase tracking-[0.17em]"
              >
                Ucapan &amp; doa
              </label>
              <textarea
                id="mixtape-wish"
                rows={1}
                value={wish}
                onChange={(event) => setWish(event.target.value)}
                className="mt-1 w-full border-b border-current bg-transparent py-2 font-(family-name:--tpl-font-body) outline-none"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-block rounded-full border border-current px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.17em] font-(family-name:--tpl-font-body) disabled:opacity-50 hover:bg-(--tpl-bg-secondary) hover:text-(--tpl-text-secondary) cursor-pointer"
          >
            {status === "submitting" ? "Mengirim…" : "Kirim konfirmasi"}
          </button>
        </form>
      )}

      <Grain tone="lite" />
    </section>
  );
}
