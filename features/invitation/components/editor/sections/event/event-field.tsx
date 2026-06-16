"use client";

import { useEventUpdate } from "@/features/invitation/hooks/editor-sections/use-event-update";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import {
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../../editor-field";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeRangePicker } from "@/components/ui/time-range-picker";

export function EventTitleField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.events.find((e) => e.id === id)?.title ?? "",
  );
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`event-title-${id}`}>Nama Acara</EditorLabel>
      <EditorInput
        id={`event-title-${id}`}
        autoComplete="off"
        placeholder="Akad Nikah"
        value={value}
        onChange={(e) => update({ title: e.target.value })}
      />
    </EditorField>
  );
}

export function EventDateField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.events.find((e) => e.id === id)?.date ?? "",
  );
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`event-date-${id}`}>Tanggal</EditorLabel>
      <DatePicker
        id={`event-date-${id}`}
        value={value}
        onChange={(date) => update({ date })}
        yearsBack={1}
        yearsForward={5}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
    </EditorField>
  );
}

export function EventTimeField({ id }: { id: string }) {
  const event = useInvitationStore((s) => s.events.find((e) => e.id === id));
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`event-time-${id}`}>Waktu</EditorLabel>
      <TimeRangePicker
        startId={`event-time-${id}`}
        start={event?.timeStart}
        end={event?.timeEnd}
        timezone={event?.timezone}
        onStartChange={(timeStart) => update({ timeStart })}
        onEndChange={(timeEnd) => update({ timeEnd })}
        onTimezoneChange={(timezone) => update({ timezone })}
        className="h-auto border-transparent bg-muted/60 px-2.5 py-2 text-[13px] shadow-none hover:bg-muted"
      />
    </EditorField>
  );
}

export function EventLocationField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.events.find((e) => e.id == id)?.locationName ?? "",
  );
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`event-location-name-${id}`}>Lokasi</EditorLabel>
      <EditorInput
        id={`event-location-name-${id}`}
        autoComplete="off"
        placeholder="Gedung Serbaguna XYZ"
        value={value}
        onChange={(e) => update({ locationName: e.target.value })}
      />
    </EditorField>
  );
}

export function EventDescField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.events.find((e) => e.id === id)?.description ?? "",
  );
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`event-desc-${id}`}>Deskripsi</EditorLabel>
      <EditorTextarea
        id={`event-desc-${id}`}
        placeholder="Bertempat di Gedung Serbaguna, Jl. Merdeka No. 1"
        value={value}
        onChange={(e) => update({ description: e.target.value })}
      />
    </EditorField>
  );
}

export function EventLocationMapsUrlField({ id }: { id: string }) {
  const value = useInvitationStore(
    (s) => s.events.find((e) => e.id == id)?.mapsUrl ?? "",
  );
  const update = useEventUpdate(id);

  return (
    <EditorField>
      <EditorLabel htmlFor={`events-location-maps-url-${id}`}>
        Link Google Maps
      </EditorLabel>
      <EditorInput
        id={`events-location-maps-url-${id}`}
        placeholder="Tempel link dari Google Maps"
        value={value}
        onChange={(e) => update({ mapsUrl: e.target.value })}
      />
    </EditorField>
  );
}
