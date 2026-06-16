export type PlaceResult = {
  label: string;
  lat: string;
  lon: string;
};

export type PhotonFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: number[] };
  properties: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    countrycode?: string;
    [key: string]: unknown;
  };
};

const ENDPOINT = "https://photon.komoot.io/api/";
// Edge box Indonesia: minLon,minLat,maxLon,maxLat.
const INDONESIA_BBOX = "95,-11,141,6";
// Bias point for relevance result with Indonesia priority
const INDONESIA_CENTER = { lat: "-2.5", lon: "118" };

export function buildMapsUrl(lat: string, lon: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

export function mapPhotonFeature(feature: PhotonFeature): PlaceResult | null {
  const coords = feature.geometry?.coordinates;
  if (!coords || coords.length < 2) return null;

  const [lon, lat] = coords;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;

  const p = feature.properties ?? {};
  const parts = [p.name, p.street, p.city, p.state].filter(
    (v): v is string => typeof v === "string" && v.trim() !== "",
  );
  const label = [...new Set(parts)].join(", ");
  if (!label) return null;

  return { label, lat: String(lat), lon: String(lon) };
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<PlaceResult[]> {
  const q = query.trim();
  if (!q) return [];

  const params = new URLSearchParams({
    q,
    limit: "5",
    lang: "default",
    bbox: INDONESIA_BBOX,
    lat: INDONESIA_CENTER.lat,
    lon: INDONESIA_CENTER.lon,
  });

  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, { signal });
    if (!res.ok) return [];

    const data: { features?: PhotonFeature[] } = await res.json();
    return (data.features ?? [])
      .filter((f) => {
        const cc = f.properties?.countrycode;
        return cc === undefined || cc === "ID";
      })
      .map(mapPhotonFeature)
      .filter((p): p is PlaceResult => p !== null);
  } catch {
    // Abort or network problem - return [] for stable UI
    return [];
  }
}

function toCoords(value: string | null): { lat: string; lon: string } | null {
  if (!value) return null;
  const [lat, lon] = value.split(",");
  if (lat === undefined || lon === undefined) return null;
  if (lat.trim() === "" || lon.trim() === "") return null;
  if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) return null;
  return { lat: lat.trim(), lon: lon.trim() };
}

export function parseCoordsFromMapsUrl(
  mapsUrl: string,
): { lat: string; lon: string } | null {
  if (!mapsUrl) return null;

  let url: URL;
  try {
    url = new URL(mapsUrl);
  } catch {
    return null;
  }

  const fromParams =
    toCoords(url.searchParams.get("query")) ??
    toCoords(url.searchParams.get("q")) ??
    toCoords(url.searchParams.get("ll"));
  if (fromParams) return fromParams;

  const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) return { lat: at[1], lon: at[2] };

  return null;
}

export function buildOsmEmbedUrl(lat: string, lon: string): string {
  const latN = Number(lat);
  const lonN = Number(lon);
  const delta = 0.003;
  const round = (n: number) => Number(n.toFixed(3)).toString();
  const bbox = [
    round(lonN - delta),
    round(latN - delta),
    round(lonN + delta),
    round(latN + delta),
  ].join(",");

  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${lat},${lon}`,
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
