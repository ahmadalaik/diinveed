import { describe, it, expect } from "vitest";
import {
  buildMapsUrl,
  parseCoordsFromMapsUrl,
  buildOsmEmbedUrl,
  mapPhotonFeature,
  type PhotonFeature,
} from "@/features/invitation/lib/geocoding";

describe("parseCoordsFromMapsUrl", () => {
  it("extracts coords from a URL built by buildMapsUrl", () => {
    const url = buildMapsUrl("-6.2", "106.8");
    expect(parseCoordsFromMapsUrl(url)).toEqual({ lat: "-6.2", lon: "106.8" });
  });

  it("extracts coords from a Google Maps @lat,lon path", () => {
    expect(
      parseCoordsFromMapsUrl(
        "https://www.google.com/maps/place/Monas/@-6.1753924,106.8271528,17z",
      ),
    ).toEqual({ lat: "-6.1753924", lon: "106.8271528" });
  });

  it("extracts coords from a ?q=lat,lon query", () => {
    expect(
      parseCoordsFromMapsUrl("https://maps.google.com/?q=-6.2,106.8"),
    ).toEqual({ lat: "-6.2", lon: "106.8" });
  });

  it("extracts coords from an &ll=lat,lon query", () => {
    expect(
      parseCoordsFromMapsUrl("https://maps.google.com/maps?ll=-6.2,106.8&z=15"),
    ).toEqual({ lat: "-6.2", lon: "106.8" });
  });

  it("returns null for an empty string", () => {
    expect(parseCoordsFromMapsUrl("")).toBeNull();
  });

  it("returns null for a short link without coordinates", () => {
    expect(
      parseCoordsFromMapsUrl("https://maps.app.goo.gl/abc123"),
    ).toBeNull();
  });

  it("returns null when query is not a valid coordinate pair", () => {
    expect(
      parseCoordsFromMapsUrl(
        "https://www.google.com/maps/search/?api=1&query=Monas",
      ),
    ).toBeNull();
  });
});

describe("buildOsmEmbedUrl", () => {
  it("builds an OSM embed URL with bbox and marker", () => {
    const url = buildOsmEmbedUrl("-6.2", "106.8");
    expect(url).toContain("https://www.openstreetmap.org/export/embed.html");
    expect(url).toContain("layer=mapnik");
    expect(url).toContain("marker=-6.2%2C106.8");
    expect(url).toContain("bbox=");
  });

  it("computes bbox as lon/lat minus and plus a fixed delta", () => {
    const url = buildOsmEmbedUrl("-6.2", "106.8");
    const bbox = new URL(url).searchParams.get("bbox");
    // bbox order: minLon,minLat,maxLon,maxLat with delta 0.003
    expect(bbox).toBe("106.797,-6.203,106.803,-6.197");
  });
});

describe("mapPhotonFeature", () => {
  const feature = (
    props: Record<string, unknown>,
    coordinates: [number, number] | null = [106.8310056, -6.1702395],
  ): PhotonFeature =>
    ({
      type: "Feature",
      properties: props,
      geometry: coordinates
        ? { type: "Point", coordinates }
        : { type: "Point", coordinates: [] },
    }) as PhotonFeature;

  it("builds a label and coords from a full feature", () => {
    const result = mapPhotonFeature(
      feature({
        name: "Masjid Istiqlal",
        street: "Jalan KH Hasyim Asyari",
        city: "DKI Jakarta",
        state: "Jawa",
        countrycode: "ID",
      }),
    );
    expect(result).toEqual({
      label: "Masjid Istiqlal, Jalan KH Hasyim Asyari, DKI Jakarta, Jawa",
      lat: "-6.1702395",
      lon: "106.8310056",
    });
  });

  it("skips empty label parts and de-duplicates", () => {
    const result = mapPhotonFeature(
      feature({ name: "Bandung", city: "Bandung", state: "Jawa Barat" }),
    );
    expect(result?.label).toBe("Bandung, Jawa Barat");
  });

  it("returns null when the feature has no coordinates", () => {
    expect(mapPhotonFeature(feature({ name: "X" }, null))).toBeNull();
  });

  it("returns null when there is no name or address parts", () => {
    expect(mapPhotonFeature(feature({}))).toBeNull();
  });
});
