"use client";

import {
  EventItem,
  GiftItem,
  InvitationState,
  StoryItem,
} from "@/features/invitation/types/invitation.type";
import { getToken, mergeTokenOverrides } from "@/features/template/tokens";
import { STICKERS } from "../../configs/stickers";

type Props = { invitation: InvitationState };

function resolveStyle(inv: InvitationState) {
  const base = getToken(inv.tokenId) ?? getToken("aura")!;
  const token = mergeTokenOverrides(base, inv.tokenOverrides);
  return {
    bg: token.colors.background,
    ink: token.colors.primary,
    accent: token.colors.accent,
    fontHeading: `${token.typography.heading}, Georgia, serif`,
    fontBody: `${token.typography.body}, Inter, system-ui, sans-serif`,
    name: token.name,
  };
}

export function InvitationCard({ invitation: inv }: Props) {
  const style = resolveStyle(inv);
  const activeStickers = STICKERS.filter((s) => inv.stickers.includes(s.id));

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.ink,
        fontFamily: style.fontBody,
      }}
      className="w-full rounded-xl overflow-hidden"
    >
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center py-20 px-8 text-center"
        style={{ borderBottom: `1px solid ${style.accent}` }}
      >
        {activeStickers.length > 0 && (
          <div className="absolute top-6 right-6 flex gap-2 text-2xl opacity-60">
            {activeStickers.slice(0, 3).map((s) => (
              <span key={s.id}>{s.glyph}</span>
            ))}
          </div>
        )}
        <p
          className="text-sm tracking-widest uppercase mb-4"
          style={{ color: style.accent }}
        >
          {style.name}
        </p>
        <h1
          className="text-5xl font-bold mb-3"
          style={{ fontFamily: style.fontHeading }}
        >
          {inv.title || "Couple Name"}
        </h1>
        <p className="text-lg italic opacity-75">{inv.subtitle}</p>
        {inv.date && (
          <p
            className="mt-6 text-sm tracking-wider"
            style={{ color: style.accent }}
          >
            {inv.date} {inv.time && `· ${inv.time}`}
          </p>
        )}
        {inv.hosts && (
          <p className="mt-2 text-sm opacity-60">Hosted by {inv.hosts}</p>
        )}
      </section>

      {/* Message */}
      {inv.message && (
        <section className="py-12 px-10 text-center">
          <p className="text-lg leading-relaxed italic opacity-80">
            {inv.message}
          </p>
        </section>
      )}

      {/* Cover Image */}
      {inv.coverImage && (
        <section className="px-8 pb-8">
          <img
            src={inv.coverImage}
            alt="Cover"
            className="w-full h-64 object-cover rounded-lg"
          />
        </section>
      )}

      {/* Events */}
      {(inv.events as EventItem[]).length > 0 && (
        <section
          className="py-10 px-8"
          style={{ borderTop: `1px solid ${style.accent}20` }}
        >
          <h2
            className="text-center text-2xl font-semibold mb-8"
            style={{ fontFamily: style.fontHeading }}
          >
            Events
          </h2>
          <div className="space-y-4">
            {(inv.events as EventItem[]).map((e, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="w-1 rounded-full shrink-0"
                  style={{ backgroundColor: style.accent }}
                />
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm opacity-60">{e.time}</p>
                  {e.description && (
                    <p className="text-sm mt-1 opacity-75">{e.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Location */}
      {inv.venueName && (
        <section
          className="py-10 px-8"
          style={{ borderTop: `1px solid ${style.accent}20` }}
        >
          <h2
            className="text-center text-2xl font-semibold mb-4"
            style={{ fontFamily: style.fontHeading }}
          >
            Location
          </h2>
          <div className="text-center">
            <p className="font-medium text-lg">{inv.venueName}</p>
            {inv.venueAddress && (
              <p className="text-sm opacity-60 mt-1">{inv.venueAddress}</p>
            )}
          </div>
          <div
            className="mt-6 h-32 rounded-lg flex items-center justify-center opacity-30"
            style={{ backgroundColor: style.accent }}
          >
            <span className="text-4xl">📍</span>
          </div>
        </section>
      )}

      {/* Our Story */}
      {(inv.stories as StoryItem[]).length > 0 && (
        <section
          className="py-10 px-8"
          style={{ borderTop: `1px solid ${style.accent}20` }}
        >
          <h2
            className="text-center text-2xl font-semibold mb-8"
            style={{ fontFamily: style.fontHeading }}
          >
            Our Story
          </h2>
          <div className="space-y-6">
            {(inv.stories as StoryItem[]).map((s, i) => (
              <div key={i} className="grid grid-cols-[4rem_1fr] gap-4">
                <p
                  className="text-sm font-bold"
                  style={{ color: style.accent }}
                >
                  {s.year}
                </p>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm opacity-70 mt-1">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {inv.gallery.length > 0 && (
        <section
          className="py-10 px-8"
          style={{ borderTop: `1px solid ${style.accent}20` }}
        >
          <h2
            className="text-center text-2xl font-semibold mb-6"
            style={{ fontFamily: style.fontHeading }}
          >
            Gallery
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {inv.gallery.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-full h-28 object-cover rounded-md"
              />
            ))}
          </div>
        </section>
      )}

      {/* Gifts */}
      {(inv.gifts as GiftItem[]).length > 0 && (
        <section
          className="py-10 px-8"
          style={{ borderTop: `1px solid ${style.accent}20` }}
        >
          <h2
            className="text-center text-2xl font-semibold mb-6"
            style={{ fontFamily: style.fontHeading }}
          >
            Gift Registry
          </h2>
          <div className="space-y-3">
            {(inv.gifts as GiftItem[]).map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between border rounded-lg p-3"
              >
                <div>
                  <p className="font-medium">{g.name}</p>
                  {g.description && (
                    <p className="text-sm opacity-60">{g.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Block */}
      {inv.rsvpDeadline && (
        <section
          className="py-10 px-8 text-center"
          style={{
            borderTop: `1px solid ${style.accent}20`,
            backgroundColor: `${style.accent}10`,
          }}
        >
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: style.fontHeading }}
          >
            RSVP
          </h2>
          <p className="text-sm opacity-60">
            Please respond by {inv.rsvpDeadline}
          </p>
          {inv.dressCode && (
            <p className="mt-3 text-sm">
              <span className="font-medium">Dress Code:</span> {inv.dressCode}
            </p>
          )}
        </section>
      )}

      {/* Footer */}
      <footer
        className="py-6 text-center text-xs opacity-40"
        style={{ borderTop: `1px solid ${style.accent}20` }}
      >
        Made with love
      </footer>
    </div>
  );
}
