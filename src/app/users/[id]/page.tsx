import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/users/public-profile-view";
import { serverFetch } from "@/lib/api/server";
import { getServerMessages } from "@/lib/i18n/server";
import {
  publicUserDisplayName,
  type PublicUserProfileResponse,
} from "@/lib/users/types";

type UserProfilePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const messages = await getServerMessages();
  try {
    const { user } = await serverFetch<PublicUserProfileResponse>(
      `/api/v1/users/${id}`,
    );
    return {
      title: `${publicUserDisplayName(user)} | ${messages.metadata.title}`,
    };
  } catch {
    return { title: messages.metadata.title };
  }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = await params;

  let profile: PublicUserProfileResponse;
  try {
    profile = await serverFetch<PublicUserProfileResponse>(
      `/api/v1/users/${id}`,
    );
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
      <PublicProfileView user={profile.user} listings={profile.listings} />
    </main>
  );
}
