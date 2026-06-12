"use client";

import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { useEventUpdate } from "@/features/invitation/hooks/editor-sections/use-event-update";
import { arrayMove } from "@dnd-kit/sortable";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  buildMapsUrl,
  buildOsmEmbedUrl,
  parseCoordsFromMapsUrl,
  searchPlaces,
  type PlaceResult,
} from "@/features/invitation/lib/geocoding";
import {
  EditorError,
  EditorField,
  EditorInput,
  EditorLabel,
  EditorTextarea,
} from "../editor-field";

function EventTitleField({ id }: { id: string }) {
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

function EventDateField({ id }: { id: string }) {
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

function EventTimeField({ id }: { id: string }) {
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

function EventDescField({ id }: { id: string }) {
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

function EventLocationField({ id }: { id: string }) {
  const locationName = useInvitationStore(
    (s) => s.events.find((e) => e.id === id)?.locationName ?? "",
  );
  const mapsUrl = useInvitationStore(
    (s) => s.events.find((e) => e.id === id)?.mapsUrl ?? "",
  );
  const update = useEventUpdate(id);

  const coords = parseCoordsFromMapsUrl(mapsUrl);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  useEffect(() => {
    const q = query.trim();
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (!q) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const places = await searchPlaces(q, controller.signal);
      setResults(places);
      setLoading(false);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const select = (place: PlaceResult) => {
    update({
      locationName: place.label,
      mapsUrl: buildMapsUrl(place.lat, place.lon),
    });
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const clear = () => update({ locationName: "", mapsUrl: "" });

  const saveManual = () => {
    const name = manualName.trim();
    if (!name) return;
    update({ locationName: name, mapsUrl: manualUrl.trim() });
    setOpen(false);
    setManualOpen(false);
    setManualName("");
    setManualUrl("");
    setQuery("");
    setResults([]);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setManualOpen(false);
  };

  return (
    <EditorField>
      <EditorLabel>Lokasi</EditorLabel>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-auto justify-between rounded-md border-transparent bg-muted/60 px-2.5 py-2 text-[13px] font-normal shadow-none hover:bg-muted",
              !locationName && "text-muted-foreground",
            )}
          >
            <span className="truncate text-left">
              {locationName || "Cari lokasi…"}
            </span>
            <MapPin className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) p-0"
        >
          {manualOpen ? (
            <div className="space-y-2.5 p-3">
              <div className="space-y-1">
                <Label htmlFor={`manual-name-${id}`} className="text-xs">
                  Nama lokasi
                </Label>
                <Input
                  id={`manual-name-${id}`}
                  autoFocus
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Gedung Serbaguna XYZ"
                  className="h-8 text-[13px]"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`manual-url-${id}`} className="text-xs">
                  Link Google Maps{" "}
                  <span className="text-muted-foreground">(opsional)</span>
                </Label>
                <Input
                  id={`manual-url-${id}`}
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="Tempel link dari Google Maps"
                  className="h-8 text-[13px]"
                />
              </div>
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setManualOpen(false)}
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs"
                  disabled={!manualName.trim()}
                  onClick={saveManual}
                >
                  Simpan
                </Button>
              </div>
            </div>
          ) : (
            <Command shouldFilter={false}>
              <CommandInput
                value={query}
                onValueChange={setQuery}
                placeholder="Ketik nama tempat, jalan, desa, kota…"
              />
              <CommandList>
                {loading && (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    Mencari…
                  </div>
                )}
                {!loading && query.trim() && results.length === 0 && (
                  <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                )}
                {results.map((place) => (
                  <CommandItem
                    key={`${place.lat}-${place.lon}`}
                    value={`${place.lat}-${place.lon}`}
                    onSelect={() => select(place)}
                  >
                    <MapPin className="size-4 shrink-0 opacity-60" />
                    <span className="truncate">{place.label}</span>
                  </CommandItem>
                ))}
              </CommandList>
              <div className="border-t p-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-start text-xs text-muted-foreground"
                  onClick={() => setManualOpen(true)}
                >
                  <Pencil className="size-3.5" />
                  Isi lokasi manual
                </Button>
              </div>
            </Command>
          )}
        </PopoverContent>
      </Popover>
      {locationName && (
        <button
          type="button"
          onClick={clear}
          className="self-start text-[10.5px] text-muted-foreground transition-colors hover:text-destructive"
        >
          Hapus lokasi
        </button>
      )}
      {coords && (
        <iframe
          title={`Peta ${locationName || "lokasi"}`}
          src={buildOsmEmbedUrl(coords.lat, coords.lon)}
          loading="lazy"
          className="mt-1 h-35 w-full rounded-md border border-border"
        />
      )}
    </EditorField>
  );
}

interface EventCardProps {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function EventCard({ id, index, total, onMoveUp, onMoveDown }: EventCardProps) {
  const set = useInvitationStore((s) => s.set);

  const remove = () => {
    const events = useInvitationStore.getState().events;
    set({ events: events.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Event {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:cursor-pointer disabled:opacity-30"
              disabled={index === 0}
              onClick={onMoveUp}
              aria-label="Pindah ke atas"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 hover:cursor-pointer disabled:opacity-30"
              disabled={index === total - 1}
              onClick={onMoveDown}
              aria-label="Pindah ke bawah"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 hover:bg-destructive/10 hover:cursor-pointer"
            onClick={remove}
            aria-label="Hapus event"
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </div>
      <FieldGroup>
        <EventTitleField id={id} />
        <EventDateField id={id} />
        <EventTimeField id={id} />
        <EventDescField id={id} />
        <EventLocationField id={id} />
      </FieldGroup>
    </div>
  );
}

export function EventsSection() {
  const ids = useInvitationStore(useShallow((s) => s.events.map((e) => e.id)));
  const errors = useInvitationStore((s) => s.publishErrors?.events);
  const set = useInvitationStore((s) => s.set);

  const add = () => {
    const events = useInvitationStore.getState().events;
    set({
      events: [
        ...events,
        {
          id: crypto.randomUUID(),
          date: "",
          timeStart: "",
          timeEnd: "",
          timezone: "WIB",
          title: "",
          description: "",
          locationName: "",
          mapsUrl: "",
        },
      ],
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const events = useInvitationStore.getState().events;
    const target = index + direction;
    if (target < 0 || target >= events.length) return;
    set({ events: arrayMove(events, index, target) });
  };

  return (
    <div className="space-y-3">
      <EditorError errors={errors} />
      {ids.map((id, index) => (
        <EventCard
          key={id}
          id={id}
          index={index}
          total={ids.length}
          onMoveUp={() => move(index, -1)}
          onMoveDown={() => move(index, 1)}
        />
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full hover:cursor-pointer"
        onClick={add}
      >
        <Plus className="h-4 w-4 mr-1" /> Tambah Event
      </Button>
    </div>
  );
}
