"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getCityCenter,
  normalizeCityForMap,
  type MapCoordinates,
} from "@/lib/listings/coordinates";

const markerIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:#6366f1;border:3px solid #fff;box-shadow:0 2px 8px rgba(30,27,75,.35)"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapViewSync({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

function MapClickHandler({
  onPick,
  disabled,
}: {
  onPick: (coords: MapCoordinates) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
}

type ListingLocationMapProps = {
  city: string;
  value: MapCoordinates | null;
  onChange?: (coords: MapCoordinates | null) => void;
  readOnly?: boolean;
  className?: string;
  zoom?: number;
};

export function ListingLocationMap({
  city,
  value,
  onChange,
  readOnly = false,
  className = "h-64 w-full rounded-xl",
  zoom = 13,
}: ListingLocationMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cityKey = normalizeCityForMap(city);
  const cityCenter = getCityCenter(city);
  const viewCenter: [number, number] = [
    cityCenter.latitude,
    cityCenter.longitude,
  ];

  if (!mounted) {
    return (
      <div
        className={`${className} animate-pulse bg-background-muted`}
        aria-hidden
      />
    );
  }

  return (
    <div className={`overflow-hidden border border-border ${className}`}>
      <MapContainer
        key={cityKey || "default"}
        center={viewCenter}
        zoom={zoom}
        scrollWheelZoom={!readOnly}
        className="size-full"
        attributionControl={readOnly}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewSync center={viewCenter} zoom={zoom} />
        {!readOnly && onChange ? (
          <MapClickHandler onPick={onChange} disabled={!cityKey} />
        ) : null}
        {value ? (
          <Marker
            position={[value.latitude, value.longitude]}
            icon={markerIcon}
            draggable={!readOnly && Boolean(onChange)}
            eventHandlers={
              !readOnly && onChange
                ? {
                    dragend(e) {
                      const { lat, lng } = e.target.getLatLng();
                      onChange({ latitude: lat, longitude: lng });
                    },
                  }
                : undefined
            }
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
