"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { messages } from "@/lib/i18n/messages";
import {
  googleMapsUrl,
  hasMapLocation,
  type MapCoordinates,
} from "@/lib/listings/coordinates";
import type { Listing } from "@/lib/listings/types";

const ListingLocationMap = dynamic(
  () =>
    import("@/components/listings/listing-location-map").then(
      (m) => m.ListingLocationMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full animate-pulse rounded-xl bg-background-muted sm:h-72" />
    ),
  },
);

type ListingLocationSectionProps = {
  listing: Listing;
};

export function ListingLocationSection({ listing }: ListingLocationSectionProps) {
  if (!hasMapLocation(listing)) return null;

  const coords: MapCoordinates = {
    latitude: listing.latitude,
    longitude: listing.longitude,
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-foreground">
        {messages.listingDetail.location}
      </h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground-muted">
        <HiOutlineMapPin className="size-4 shrink-0" aria-hidden />
        {listing.city}
      </p>
      <div className="mt-4">
        <ListingLocationMap
          city={listing.city}
          value={coords}
          readOnly
          className="h-56 w-full rounded-xl sm:h-72"
          zoom={14}
        />
      </div>
      <p className="mt-3">
        <Link
          href={googleMapsUrl(coords.latitude, coords.longitude)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-foreground-accent hover:text-accent-hover">
          {messages.listingDetail.openInMaps}
        </Link>
      </p>
    </section>
  );
}
