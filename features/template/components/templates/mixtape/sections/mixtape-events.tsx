import { formatDate } from "@/features/invitation/lib/datetime";
import type {
  EventItem,
  InvitationState,
} from "@/features/invitation/types/invitation.type";
import { Grain } from "../motifs/grain";
import { MixtapeHeading } from "../motifs/heading";
import { MixtapePill } from "../motifs/pill";

type MixtapeEventsProps = { inv: InvitationState };

/**
 * Baris rundown: tanggal manusiawi + jam. Tiap fragmen dibangun bersyarat
 * supaya `timeStart`/`timeEnd`/`timezone` yang kosong tidak meninggalkan
 * " · " nyasar atau tanda hubung menggantung.
 */
function eventSchedule(event: EventItem): string {
  const dateLabel = formatDate(event.date, "EEEE, d MMMM yyyy");
  const timeRange = [event.timeStart, event.timeEnd].filter(Boolean).join("–");
  const timeLabel = timeRange
    ? [timeRange, event.timezone].filter(Boolean).join(" ")
    : "";
  return [dateLabel, timeLabel].filter(Boolean).join(" · ");
}

export function MixtapeEvents({ inv }: MixtapeEventsProps) {
  if (inv.events.length === 0) return null;

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: "var(--tpl-bg-secondary)",
        color: "var(--tpl-text-secondary)",
      }}
    >
      <MixtapeHeading thin="Rundown" bold="hari itu" className="text-3xl" />

      <div className="relative z-10 mt-6 flex flex-col gap-7">
        {inv.events.map((event) => (
          <article key={event.id}>
            <h3
              className="text-xl font-(family-name:--tpl-font-heading)"
              style={{ fontWeight: "var(--tpl-weight-heading)" }}
            >
              {event.title}
            </h3>
            <p className="mt-1 text-sm font-(family-name:--tpl-font-body)">
              {eventSchedule(event)}
            </p>
            {event.locationName ? (
              <p
                className="mt-1 text-sm font-(family-name:--tpl-font-body)"
                style={{ opacity: 0.8 }}
              >
                {event.locationName}
              </p>
            ) : null}
            {event.description ? (
              <p
                className="mt-1 text-xs font-(family-name:--tpl-font-body)"
                style={{ opacity: 0.7 }}
              >
                {event.description}
              </p>
            ) : null}
            {event.mapsUrl ? (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block"
              >
                <MixtapePill className="hover:bg-(--tpl-bg-primary) hover:text-(--tpl-text-primary)">
                  Lihat lokasi
                </MixtapePill>
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <Grain tone="dark" />
    </section>
  );
}
