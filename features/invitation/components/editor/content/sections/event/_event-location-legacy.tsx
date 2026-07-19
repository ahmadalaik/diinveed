"use client";

import { useEffect, useState } from "react";
import { useEventUpdate } from "@/features/invitation/hooks/editor-sections/use-event-update";
import {
  buildMapsUrl,
  buildOsmEmbedUrl,
  parseCoordsFromMapsUrl,
  PlaceResult,
  searchPlaces,
} from "@/features/invitation/lib/geocoding";
import { useInvitationStore } from "@/features/invitation/store/invitation-store";
import { EditorField, EditorLabel } from "../../../editor-field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapPin, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function EventLocationLegacy({ id }: { id: string }) {
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
