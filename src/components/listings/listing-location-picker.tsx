"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useMessages } from "@/contexts/locale-context";
import {
  normalizeCityForMap,
  type MapCoordinates,
} from "@/lib/listings/coordinates";

const ListingLocationMap = dynamic(
  () =>
    import("@/components/listings/listing-location-map").then(
      (m) => m.ListingLocationMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-xl bg-background-muted" />
    ),
  },
);

type ListingLocationPickerProps = {
  city: string;
  value: MapCoordinates | null;
  onChange: (coords: MapCoordinates | null) => void;
};

export function ListingLocationPicker({
  city,
  value,
  onChange,
}: ListingLocationPickerProps) {
  const messages = useMessages();
  const cityKey = normalizeCityForMap(city);
  const prevCityKeyRef = useRef(cityKey);

  useEffect(() => {
    if (prevCityKeyRef.current === cityKey) return;
    prevCityKeyRef.current = cityKey;
    onChange(null);
  }, [cityKey, onChange]);

  if (!cityKey) {
    return (
      <p className="text-sm text-foreground-muted">
        {messages.listingForm.mapLocationSelectCity}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">
            {messages.listingForm.mapLocation}
          </p>
          <p className="text-xs text-foreground-subtle">
            {messages.listingForm.mapLocationHint(city.trim())}
          </p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm font-medium text-foreground-accent hover:text-accent-hover">
            {messages.listingForm.mapLocationClear}
          </button>
        ) : null}
      </div>

      <ListingLocationMap city={city} value={value} onChange={onChange} />

      {value ? (
        <p className="text-xs text-foreground-muted">
          {messages.listingForm.mapLocationSet(
            value.latitude.toFixed(5),
            value.longitude.toFixed(5),
          )}
        </p>
      ) : (
        <p className="text-xs text-foreground-muted">
          {messages.listingForm.mapLocationEmpty}
        </p>
      )}
    </div>
  );
}
