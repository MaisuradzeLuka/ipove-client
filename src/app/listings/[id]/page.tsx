import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingDetailView } from "@/components/listings/listing-detail-view";
import { serverFetch } from "@/lib/api/server";
import { getServerMessages } from "@/lib/i18n/server";
import type { ListingResponse } from "@/lib/listings/types";
import type { User } from "@/lib/auth/types";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

type MeResponse = { user: User };

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const messages = await getServerMessages();
  try {
    const { listing } = await serverFetch<ListingResponse>(
      `/api/v1/listings/${id}`,
      { auth: true },
    );
    return { title: `${listing.title} | ${messages.metadata.title}` };
  } catch {
    return { title: messages.metadata.title };
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  let listingResponse: ListingResponse;
  try {
    listingResponse = await serverFetch<ListingResponse>(
      `/api/v1/listings/${id}`,
      { auth: true },
    );
  } catch {
    notFound();
  }

  let currentUserId: string | null = null;
  try {
    const me = await serverFetch<MeResponse>("/api/v1/auth/me", { auth: true });
    currentUserId = me.user.userId;
  } catch {
    currentUserId = null;
  }

  const isOwner = currentUserId === listingResponse.listing.userId;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8 sm:py-10">
      <ListingDetailView
        listing={listingResponse.listing}
        isOwner={isOwner}
      />
    </main>
  );
}
