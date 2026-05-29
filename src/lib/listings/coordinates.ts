/** Approximate city centers for map defaults (Georgia). */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  თბილისი: { lat: 41.7151, lng: 44.8271 },
  ბათუმი: { lat: 41.6458, lng: 41.6416 },
  ქუთაისი: { lat: 42.2679, lng: 42.6946 },
  რუსთავი: { lat: 41.5494, lng: 45.0111 },
  გორი: { lat: 41.9842, lng: 44.1158 },
  ზუგდიდი: { lat: 42.5088, lng: 41.8709 },
  ფოთი: { lat: 42.1509, lng: 41.6712 },
  სამტრედია: { lat: 42.1623, lng: 42.3412 },
  ხაშური: { lat: 41.9291, lng: 43.9718 },
  თელავი: { lat: 41.9198, lng: 45.4714 },
};

/** Latin / alternate spellings → canonical Georgian city keys. */
const CITY_ALIASES: Record<string, keyof typeof CITY_COORDINATES> = {
  tbilisi: "თბილისი",
  batumi: "ბათუმი",
  kutaisi: "ქუთაისი",
  rustavi: "რუსთავი",
  gori: "გორი",
  zugdidi: "ზუგდიდი",
  poti: "ფოთი",
  samtredia: "სამტრედია",
  khashuri: "ხაშური",
  telavi: "თელავი",
};

export const DEFAULT_MAP_CENTER = CITY_COORDINATES["თბილისი"];

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

export function normalizeCityForMap(city: string): string {
  const trimmed = city.trim();
  if (!trimmed) return "";

  if (trimmed in CITY_COORDINATES) return trimmed;

  const alias = CITY_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;

  return trimmed;
}

export function getCityCenter(city: string): MapCoordinates {
  const key = normalizeCityForMap(city);
  const center = key ? CITY_COORDINATES[key] : undefined;
  if (center) {
    return { latitude: center.lat, longitude: center.lng };
  }
  return {
    latitude: DEFAULT_MAP_CENTER.lat,
    longitude: DEFAULT_MAP_CENTER.lng,
  };
}

export function hasMapLocation(
  listing: { latitude: number | null; longitude: number | null },
): listing is { latitude: number; longitude: number } {
  return listing.latitude != null && listing.longitude != null;
}

export function googleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
